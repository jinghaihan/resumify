import type { ExportSettings, Resume } from '@resumify/shared'
import { save } from '@resumify/shared'

const REGEX_FILENAME = /filename\*?=["']?(?:UTF-\d+'')?([^"';]+)["']?/

interface ExportPDFPayload {
  resume: Resume
  settings: ExportSettings
  locale: string
}

export async function exportToPDF(payload: ExportPDFPayload): Promise<void> {
  const response = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'failed to generate PDF')
  }

  const contentDisposition = response.headers.get('Content-Disposition')
  const filenameMatch = contentDisposition?.match(REGEX_FILENAME)
  const filename = filenameMatch?.[1] ? decodeURIComponent(filenameMatch[1]) : 'resume.pdf'

  save(await response.blob(), 'application/pdf', filename)
}
