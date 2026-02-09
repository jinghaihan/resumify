import type { ExportSettings } from '@resumify/shared'

export interface ExportState {
  settings: ExportSettings
}

export interface ExportActions {
  updateSettings: (settings: Partial<ExportSettings>) => void
  updateMargin: (margin: Partial<ExportSettings['margin']>) => void
  updatePageRange: (pageRange: Partial<ExportSettings['pageRanges']>) => void
  reset: () => void
}

export type ExportStore = {} & ExportState & ExportActions
