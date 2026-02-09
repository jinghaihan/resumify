import type { ChromeReleaseChannel } from 'puppeteer-core'
import process from 'node:process'
import { executablePath } from 'puppeteer-core'

const isVercel = !!process.env.VERCEL

let cachedExecutablePath: string | null = null
let chromiumPromise: Promise<string> | null = null

export async function getChromiumPath(): Promise<string | null> {
  if (!isVercel) {
    cachedExecutablePath = await getChromePath()
    return cachedExecutablePath
  }

  if (cachedExecutablePath)
    return cachedExecutablePath

  if (chromiumPromise)
    return chromiumPromise

  const { default: chromium } = await import('@sparticuz/chromium-min')
  chromiumPromise = chromium
    .executablePath(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
      : `http://localhost:3000/chromium-pack.tar`)
    .then((path) => {
      cachedExecutablePath = path
      return path
    })
    .catch((error) => {
      console.error('Failed to get Chromium path:', error)
      chromiumPromise = null
      throw error
    })

  return chromiumPromise
}

async function getChromePath(): Promise<string | null> {
  const order: ChromeReleaseChannel[] = ['chrome', 'chrome-beta', 'chrome-canary', 'chrome-dev']
  for (const browser of order) {
    try {
      return executablePath(browser)
    }
    catch {
      continue
    }
  }
  return null
}
