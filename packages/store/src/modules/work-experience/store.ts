import type { WorkExperience } from '@resumify/shared'
import type { WorkExperienceStore } from './types'
import { APPLICATION_NAME } from '@resumify/shared'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createSection(): WorkExperience {
  return {
    id: nanoid(),
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: '',
  }
}

export const useWorkExperienceStore = create<WorkExperienceStore>()(
  persist(
    set => ({
      workExperiences: [],

      addWorkExperience() {
        set(state => ({
          workExperiences: [...state.workExperiences, createSection()],
        }))
      },
      updateWorkExperience(id, updates) {
        set(state => ({
          workExperiences: state.workExperiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp),
        }))
      },
      removeWorkExperience(id) {
        set(state => ({
          workExperiences: state.workExperiences.filter(exp => exp.id !== id),
        }))
      },
      reorderWorkExperiences(items) {
        set(state => ({
          workExperiences: items.map(id => state.workExperiences.find(exp => exp.id === id)!),
        }))
      },

      setWorkExperiences: items => set({ workExperiences: items }),

      reset: () => set({ workExperiences: [createSection()] }),
    }),
    {
      name: `${APPLICATION_NAME}-work-experience`,
      partialize: state => ({
        workExperiences: state.workExperiences,
      }),
    },
  ),
)
