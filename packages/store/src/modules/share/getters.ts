import { useShareStore } from './store'

export function shareList() {
  return useShareStore.getState().shareList
}
