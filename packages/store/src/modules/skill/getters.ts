import { useSkillStore } from './store'

export function skills() {
  return useSkillStore.getState().skills
}
