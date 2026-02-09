import type { ProjectExperience } from '@resumify/shared'
import type { ProjectExperienceStore } from './types'
import { APPLICATION_NAME } from '@resumify/shared'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createSection(): ProjectExperience {
  return {
    id: nanoid(),
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: '',
    techStack: [],
  }
}

export const useProjectExperienceStore = create<ProjectExperienceStore>()(
  persist(
    set => ({
      projectExperiences: [],

      addProjectExperience() {
        set(state => ({
          projectExperiences: [...state.projectExperiences, createSection()],
        }))
      },
      updateProjectExperience(id, updates) {
        set(state => ({
          projectExperiences: state.projectExperiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp),
        }))
      },
      removeProjectExperience(id) {
        set(state => ({
          projectExperiences: state.projectExperiences.filter(exp => exp.id !== id),
        }))
      },
      reorderProjectExperiences(items) {
        set(state => ({
          projectExperiences: items.map(id => state.projectExperiences.find(exp => exp.id === id)!),
        }))
      },

      setProjectExperiences: items => set({ projectExperiences: items }),

      reset: () => set({ projectExperiences: [createSection()] }),
    }),
    {
      name: `${APPLICATION_NAME}-project-experience`,
      partialize: state => ({
        projectExperiences: state.projectExperiences,
      }),
    },
  ),
)
