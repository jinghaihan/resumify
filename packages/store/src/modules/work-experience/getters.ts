import { useWorkExperienceStore } from './store'

export function workExperiences() {
  return useWorkExperienceStore.getState().workExperiences
}
