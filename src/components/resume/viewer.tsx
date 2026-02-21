'use client'

import type { Resume } from '@resumify/shared'
import { ResumeRenderer, SquaresGrid } from '@resumify/ui'
import { Paper } from './paper'

interface ResumeViewerProps {
  resumeData: Resume
}

export function ResumeViewer({ resumeData }: ResumeViewerProps) {
  return (
    <SquaresGrid className="
      p-0
      md:p-8
    "
    >
      <Paper>
        <ResumeRenderer
          resume={resumeData}
          draggable={false}
          columnContentClassName="p-6"
        />
      </Paper>
    </SquaresGrid>
  )
}
