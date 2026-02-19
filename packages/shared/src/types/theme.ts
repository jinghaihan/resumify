import type { StreamdownProps } from 'streamdown'

import type { ProjectExperience, Section, Skill, WorkExperience } from '../schemas'
import type { SectionDistribution } from './layout'
import type { ResumePersonalInfo } from './resume'

export interface ResumeTheme {
  id: string
  name: string
  description: string
  markdownComponents?: StreamdownProps['components']
  sectionsRenderers: ResumeSectionsRenderers
  columnsRenderers?: Record<string, (columnId: string, children: React.ReactNode) => React.ReactNode>
  defaultSectionDistribution: SectionDistribution
}

export interface ResumeSectionsRenderers {
  personalInfoRenderer: (personalInfo: ResumePersonalInfo) => React.ReactNode
  skillsRenderer: (skills: Skill[]) => React.ReactNode
  workExperiencesRenderer: (workExperience: WorkExperience[]) => React.ReactNode
  projectExperiencesRenderer: (projectExperience: ProjectExperience[]) => React.ReactNode
  customSectionRenderer: (section: Section) => React.ReactNode
}

export type LayoutMode = 'single' | 'double' | 'reversed-double'

export type PersonalInfoLayoutMode = 'stacked' | 'inline'

export type ExperienceHeaderLayoutMode = 'opposite-ends'

export interface TechStackStyle {
  background: 'colored' | 'muted' | 'outline'
  shape: 'rounded' | 'square'
}

export type Typography = 'github' | 'compact'

export interface AtomicThemeConfig {
  layout: LayoutMode
  personalInfoLayout: PersonalInfoLayoutMode
  experienceHeaderLayout: ExperienceHeaderLayoutMode
  techStackStyle: TechStackStyle
  typography: Typography
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  config: AtomicThemeConfig
}
