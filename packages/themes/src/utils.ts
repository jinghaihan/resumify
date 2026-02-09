import type { AtomicThemeConfig } from '@resumify/shared'
import { ATOMIC_THEME_CONFIG } from '.'

export function personalInfoRenderer(themeConfig: AtomicThemeConfig) {
  return ATOMIC_THEME_CONFIG.personalInfo[themeConfig.personalInfoLayout]
}

export function experienceHeaderRenderer(themeConfig: AtomicThemeConfig) {
  return ATOMIC_THEME_CONFIG.experienceHeader[themeConfig.experienceHeaderLayout]
}

export function techStackRenderer(themeConfig: AtomicThemeConfig) {
  return ATOMIC_THEME_CONFIG.techStack[`${themeConfig.techStackStyle.background}-${themeConfig.techStackStyle.shape}`]
}

export function typographyRenderer(themeConfig: AtomicThemeConfig) {
  return ATOMIC_THEME_CONFIG.typography[themeConfig.typography]
}
