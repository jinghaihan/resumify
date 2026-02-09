import type { ProjectExperience } from '@resumify/shared'

export interface ProjectExperienceState {
  projectExperiences: ProjectExperience[]
}

export interface ProjectExperienceActions {
  addProjectExperience: () => void
  updateProjectExperience: (id: string, updates: Partial<ProjectExperience>) => void
  removeProjectExperience: (id: string) => void
  reorderProjectExperiences: (items: string[]) => void
  setProjectExperiences: (items: ProjectExperience[]) => void
  reset: () => void
}

export type ProjectExperienceStore = {} & ProjectExperienceState & ProjectExperienceActions
