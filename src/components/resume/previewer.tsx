import { useResume, useResumeStore } from '@resumify/store'
import { ResumeRenderer, ZoomContainer } from '@resumify/ui'
import { Paper } from './paper'

export function ResumePreviewer() {
  const store = useResumeStore()
  const resumeState = useResume()

  return (
    <ZoomContainer>
      <Paper>
        <ResumeRenderer
          resume={resumeState}
          draggable={true}
          columnContentClassName="p-6"
          onLayoutChange={data => store.updateSectionDistribution(data)}
        />
      </Paper>
    </ZoomContainer>
  )
}

export default ResumePreviewer
