import type { DatabaseResumeListItem } from '@resumify/database'
import type { AtomicThemeConfig, Resume, ResumePresentation, SectionDistribution } from '@resumify/shared'

export interface ResumeState {
  id: string | null
  resumeName: string
  saving: boolean
  presentation: ResumePresentation
  resumeList: DatabaseResumeListItem[]
}

export interface ResumeActions {
  getResume: () => Omit<Resume, 'id'>
  updateResume: (updates: Partial<Resume>) => void
  clearResume: () => void
  updateTheme: (theme: string) => void
  computeResumeHash: (data: Omit<Resume, 'id'>) => string

  getSectionDistribution: () => SectionDistribution
  updateSectionDistribution: (distribution: SectionDistribution) => void

  updateResumeList: (list: DatabaseResumeListItem[]) => void

  exportToJSON: () => string
  importFromJSON: (content: string) => boolean

  selectPreset: (presetId: string) => void
  updateThemeConfig: <K extends keyof AtomicThemeConfig>(
    key: K,
    value: AtomicThemeConfig[K],
  ) => void
  resetThemeConfig: () => void

  updateResumeName: (name: string) => void
  save: () => Promise<{ success: boolean, error?: string, notFound?: boolean }>
}

export type ResumeStore = {} & ResumeState & ResumeActions
