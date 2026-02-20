import type { AtomicThemeConfig } from '@resumify/shared'
import { DEFAULT_RESUME_THEME } from '@resumify/shared'
import { THEME_PRESETS } from '@resumify/themes'
import { useResumeStore } from './store'

export function resumeConfigured() {
  const resumeData = resume()

  return Boolean(
    hasPersonalInfo(resumeData)
    || hasSocialLinks(resumeData)
    || hasSkills(resumeData)
    || hasWorkExperiences(resumeData)
    || hasProjectExperiences(resumeData)
    || hasSections(resumeData),
  )
}

export function resume() {
  return useResumeStore.getState().getResume()
}

export function resumeList() {
  return useResumeStore.getState().resumeList
}

export function presentation() {
  return useResumeStore.getState().presentation
}

export function resumeTheme() {
  return useResumeStore.getState().presentation.theme || DEFAULT_RESUME_THEME
}

export function themeConfig(): AtomicThemeConfig {
  const state = useResumeStore.getState()
  if (state.presentation.themeConfig)
    return state.presentation.themeConfig

  const preset = THEME_PRESETS.find(p => p.id === state.presentation.theme)
  if (preset?.config)
    return preset.config

  const minimalPreset = THEME_PRESETS.find(p => p.id === 'minimal')
  if (minimalPreset?.config)
    return minimalPreset.config

  return THEME_PRESETS[0].config
}

export function sectionDistribution() {
  return useResumeStore.getState().presentation.sectionDistribution
}

export function hasPersonalInfo(resumeData = resume()) {
  return resumeData.personalInfo.some(info => info.value.trim().length > 0)
}

export function hasSocialLinks(resumeData = resume()) {
  return resumeData.socialLinks.some(link => link.value.trim().length > 0)
}

export function hasSkills(resumeData = resume()) {
  return resumeData.skills.some(skill => skill.content.trim().length > 0)
}

export function hasWorkExperiences(resumeData = resume()) {
  return resumeData.workExperiences.some(exp =>
    exp.name.trim().length > 0
    || exp.role.trim().length > 0
    || exp.startDate.trim().length > 0
    || exp.endDate.trim().length > 0
    || exp.description.trim().length > 0
    || exp.achievements.trim().length > 0)
}

export function hasProjectExperiences(resumeData = resume()) {
  return resumeData.projectExperiences.some(proj =>
    proj.name.trim().length > 0
    || proj.role.trim().length > 0
    || proj.startDate.trim().length > 0
    || proj.endDate.trim().length > 0
    || proj.description.trim().length > 0
    || proj.achievements.trim().length > 0
    || (proj.techStack && proj.techStack.length > 0))
}

export function hasSections(resumeData = resume()) {
  return resumeData.sections.some(section => section.content.trim().length > 0)
}
