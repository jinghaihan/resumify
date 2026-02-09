import type { PersonalInfo } from '../schemas'
import type { SectionDistribution } from './layout'
import type { PhotoShape } from './photo'
import type { AtomicThemeConfig } from './theme'

/**
 * Resume presentation
 * Defines the presentation configuration of a resume
 */
export interface ResumePresentation {
  theme: string
  themeConfig: AtomicThemeConfig
  sectionDistribution: SectionDistribution
}

export interface ResumePersonalInfo {
  name: string
  photoUrl: string
  photoShape: PhotoShape
  jobObjective: string
  personalInfo: PersonalInfo[]
  socialLinks: PersonalInfo[]
}
