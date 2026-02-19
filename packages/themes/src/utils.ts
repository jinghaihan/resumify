import type { AtomicThemeConfig, ResumePersonalInfo } from '@resumify/shared'
import { ATOMIC_THEME_CONFIG, ATOMIC_THEME_SPACING } from '.'

export function personalInfoRenderer(themeConfig: AtomicThemeConfig) {
  const renderer = ATOMIC_THEME_CONFIG.personalInfo[themeConfig.personalInfoLayout]
  const spacing = ATOMIC_THEME_SPACING.typography[themeConfig.typography]

  return (personalInfo: ResumePersonalInfo) => renderer(personalInfo, {
    section: spacing.personalInfoSection,
    dividerPadding: spacing.personalInfoDividerPadding,
  })
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

export function typographySpacingRenderer(themeConfig: AtomicThemeConfig) {
  return ATOMIC_THEME_SPACING.typography[themeConfig.typography]
}
