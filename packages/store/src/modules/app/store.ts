import type { AppStore } from './types'
import { DEFAULT_LOCALE } from '@resumify/shared'
import { create } from 'zustand'

export const useAppStore = create<AppStore>()(
  set => ({
    locale: DEFAULT_LOCALE,
    editorEnabled: false,
    previewEnabled: false,

    updateLocale: locale => set({ locale }),

    updateEditorEnabled: enabled => set({ editorEnabled: enabled }),
    toggleEditorEnabled: () => set(state => ({ editorEnabled: !state.editorEnabled })),

    updatePreviewEnabled: enabled => set({ previewEnabled: enabled }),
    togglePreviewEnabled: () => set(state => ({ previewEnabled: !state.previewEnabled })),
  }),
)
