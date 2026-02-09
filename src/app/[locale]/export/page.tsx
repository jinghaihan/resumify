import type { Resume } from '@resumify/shared'
import { Result, ResumeRenderer } from '@resumify/ui'
import LZString from 'lz-string'

export interface ExportPageProps {
  searchParams: Promise<{
    data?: string
  }>
}

export default async function ExportPage({ searchParams }: ExportPageProps) {
  const { data } = await searchParams

  if (!data) {
    return (
      <Result status="error" title="Error" description="No resume data provided" />
    )
  }

  let resume: Resume
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(data)
    if (!decompressed) {
      return (
        <Result status="error" title="Error" description="Failed to decompress resume data" />
      )
    }
    resume = JSON.parse(decompressed) as Resume
  }
  catch {
    return (
      <Result status="error" title="Error" description="Invalid resume data" />
    )
  }

  return (
    <ResumeRenderer resume={resume} />
  )
}
