import { useExportStore } from './store'

export function exportSettings() {
  return useExportStore.getState().settings
}
