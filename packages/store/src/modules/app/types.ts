import type { Locale } from '@resumify/shared'

export interface AppState {
  locale: Locale
  editorEnabled: boolean
  previewEnabled: boolean
}

export interface AppActions {
  updateLocale: (locale: Locale) => void

  updateEditorEnabled: (enabled: boolean) => void
  toggleEditorEnabled: () => void

  updatePreviewEnabled: (enabled: boolean) => void
  togglePreviewEnabled: () => void
}

export type AppStore = {} & AppState & AppActions
