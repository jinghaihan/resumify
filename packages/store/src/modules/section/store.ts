import type { Section } from '@resumify/shared'
import type { SectionStore } from './types'
import { APPLICATION_NAME } from '@resumify/shared'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createSection(): Section {
  return { id: nanoid(), content: '' }
}

export const useSectionStore = create<SectionStore>()(
  persist(
    set => ({
      sections: [],

      addSection() {
        set(state => ({
          sections: [...state.sections, createSection()],
        }))
      },
      updateSection(id, updates) {
        set(state => ({
          sections: state.sections.map(section => section.id === id ? { ...section, ...updates } : section),
        }))
      },
      removeSection(id) {
        set(state => ({
          sections: state.sections.filter(section => section.id !== id),
        }))
      },
      reorderSections(items) {
        set(state => ({
          sections: items.map(id => state.sections.find(item => item.id === id)!),
        }))
      },

      setSections: items => set({ sections: items }),

      reset: () => set({ sections: [createSection()] }),
    }),
    {
      name: `${APPLICATION_NAME}-section`,
      partialize: state => ({
        sections: state.sections,
      }),
    },
  ),
)
