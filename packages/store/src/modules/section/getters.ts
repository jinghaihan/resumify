import { useSectionStore } from './store'

export function sections() {
  return useSectionStore.getState().sections
}
