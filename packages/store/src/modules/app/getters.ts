import { useAppStore } from './store'

export function locale() {
  return useAppStore.getState().locale
}

export function editorEnabled() {
  return useAppStore.getState().editorEnabled
}

export function previewEnabled() {
  return useAppStore.getState().previewEnabled
}
