import type { Section } from '@resumify/shared'

export interface SectionState {
  sections: Section[]
}

export interface SectionActions {
  addSection: () => void
  updateSection: (id: string, updates: Partial<Section>) => void
  removeSection: (id: string) => void
  reorderSections: (items: string[]) => void
  setSections: (items: Section[]) => void
  reset: () => void
}

export type SectionStore = {} & SectionState & SectionActions
