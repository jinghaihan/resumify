import type { ExportSettings, Resume } from '@resumify/shared'
import type { NextRequest } from 'next/server'
import { Buffer } from 'node:buffer'
import { sanitizeResume } from '@resumify/shared'
import chromium from '@sparticuz/chromium-min'
import LZString from 'lz-string'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'

import { getChromiumPath } from '@/lib/chromium'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export interface ExportPDFBody {
  resume: Resume
  settings: ExportSettings
  locale: string
}

async function POSTHandler(request: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null

  try {
    const body = await request.json() as ExportPDFBody
    const { resume, settings, locale } = body

    const json = JSON.stringify(sanitizeResume(resume))
    const compressed = LZString.compressToEncodedURIComponent(json)
    const exportUrl = new URL(`/${locale}/export?data=${compressed}`, request.nextUrl.origin)

    const executablePath = await getChromiumPath() || await chromium.executablePath()

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()

    await page.goto(exportUrl.toString(), {
      waitUntil: 'networkidle0',
    })

    await page.evaluateHandle('document.fonts.ready')

    const pdf = await page.pdf({
      format: settings.format,
      landscape: settings.landscape,
      printBackground: settings.printBackground,
      margin: settings.margin,
      scale: settings.scale,
      displayHeaderFooter: settings.displayHeaderFooter,
      preferCSSPageSize: settings.preferCSSPageSize,
      omitBackground: settings.omitBackground,
      outline: settings.outline,
      tagged: settings.tagged,
    })

    await browser.close()

    const filename = resume.name
      ? `${resume.name.replace(/[^a-z0-9\u4E00-\u9FA5]/gi, '_')}.pdf`
      : 'resume.pdf'

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  }
  catch (error) {
    console.error('PDF export error:', error)

    if (browser) {
      await browser.close().catch((closeError: unknown) => {
        console.error('Error closing browser:', closeError)
      })
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to generate PDF', message }, { status: 500 })
  }
}

export const POST = POSTHandler
