import { useProjectExperienceStore } from './store'

export function projectExperiences() {
  return useProjectExperienceStore.getState().projectExperiences
}
