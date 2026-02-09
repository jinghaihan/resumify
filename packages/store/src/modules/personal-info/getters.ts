import { usePersonalInfoStore } from './store'

export function resumeName() {
  return usePersonalInfoStore.getState().name
}

export function jobObjective() {
  return usePersonalInfoStore.getState().jobObjective
}

export function photoUrl() {
  return usePersonalInfoStore.getState().photoUrl
}

export function photoShape() {
  return usePersonalInfoStore.getState().photoShape
}

export function personalInfo() {
  return usePersonalInfoStore.getState().personalInfo
}

export function socialLinks() {
  return usePersonalInfoStore.getState().socialLinks
}
