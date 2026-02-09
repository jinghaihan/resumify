import type { Skill } from '@resumify/shared'

export interface SkillState {
  skills: Skill[]
}

export interface SkillActions {
  addSkill: () => void
  updateSkill: (id: string, updates: Partial<Skill>) => void
  removeSkill: (id: string) => void
  reorderSkills: (items: string[]) => void
  setSkills: (items: Skill[]) => void
  reset: () => void
}

export type SkillStore = {} & SkillState & SkillActions
