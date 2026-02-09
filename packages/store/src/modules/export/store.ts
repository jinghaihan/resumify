import type { ExportStore } from './types'
import { APPLICATION_NAME } from '@resumify/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_EXPORT_SETTINGS } from './constants'

export const useExportStore = create<ExportStore>()(
  persist(
    set => ({
      settings: DEFAULT_EXPORT_SETTINGS,

      updateSettings: (settings) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        }))
      },

      updateMargin: (margin) => {
        set(state => ({
          settings: {
            ...state.settings,
            margin: {
              ...state.settings.margin,
              ...margin,
            },
          },
        }))
      },

      updatePageRange: (pageRange) => {
        set(state => ({
          settings: {
            ...state.settings,
            pageRanges: {
              ...state.settings.pageRanges,
              ...pageRange,
            },
          },
        }))
      },

      reset: () => set({ settings: DEFAULT_EXPORT_SETTINGS }),
    }),
    {
      name: `${APPLICATION_NAME}-export`,
      partialize: state => ({
        settings: state.settings,
      }),
    },
  ),
)
