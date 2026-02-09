import type { WorkExperience } from '@resumify/shared'

export interface WorkExperienceState {
  workExperiences: WorkExperience[]
}

export interface WorkExperienceActions {
  addWorkExperience: () => void
  updateWorkExperience: (id: string, updates: Partial<WorkExperience>) => void
  removeWorkExperience: (id: string) => void
  reorderWorkExperiences: (items: string[]) => void
  setWorkExperiences: (items: WorkExperience[]) => void
  reset: () => void
}

export type WorkExperienceStore = {} & WorkExperienceState & WorkExperienceActions
