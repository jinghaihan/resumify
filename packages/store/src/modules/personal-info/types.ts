import type { PersonalInfo, PhotoShape, ResumePersonalInfo } from '@resumify/shared'
import type { _Translator } from 'next-intl'

export type PersonalInfoState = {} & ResumePersonalInfo

export interface PersonalInfoActions {
  updateName: (name: string) => void
  updateJobObjective: (jobObjective: string) => void

  updatePhotoUrl: (photoUrl: string) => void
  updatePhotoShape: (photoShape: PhotoShape) => void

  addPersonalInfo: () => void
  updatePersonalInfo: (id: string, updates: Partial<PersonalInfo>) => void
  removePersonalInfo: (id: string) => void
  reorderPersonalInfo: (items: string[]) => void
  setPersonalInfo: (items: PersonalInfo[]) => void

  addSocialLink: () => void
  updateSocialLink: (id: string, updates: Partial<PersonalInfo>) => void
  removeSocialLink: (id: string) => void
  reorderSocialLinks: (items: string[]) => void
  setSocialLinks: (items: PersonalInfo[]) => void

  resetPersonalInfo: (t: _Translator) => void
  resetSocialLinks: () => void
  reset: () => void
}

export type PersonalInfoStore = {} & PersonalInfoState & PersonalInfoActions
