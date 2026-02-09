import type { Skill } from '@resumify/shared'
import type { SkillStore } from './types'
import { APPLICATION_NAME } from '@resumify/shared'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createSection(): Skill {
  return { id: nanoid(), content: '' }
}

export const useSkillStore = create<SkillStore>()(
  persist(
    set => ({
      skills: [],

      addSkill() {
        set(state => ({
          skills: [...state.skills, createSection()],
        }))
      },
      updateSkill(id, updates) {
        set(state => ({
          skills: state.skills.map(skill => skill.id === id ? { ...skill, ...updates } : skill),
        }))
      },
      removeSkill(id) {
        set(state => ({
          skills: state.skills.filter(skill => skill.id !== id),
        }))
      },
      reorderSkills(items) {
        set(state => ({
          skills: items.map(id => state.skills.find(item => item.id === id)!),
        }))
      },

      setSkills: items => set({ skills: items }),

      reset: () => set({ skills: [createSection()] }),
    }),
    {
      name: `${APPLICATION_NAME}-skill`,
      partialize: state => ({
        skills: state.skills,
      }),
    },
  ),
)
