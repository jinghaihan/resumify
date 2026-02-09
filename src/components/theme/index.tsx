'use client'
import {
  resumeTheme as resumeThemeGetter,
  themeConfig as themeConfigGetter,
  useResumeStore,
} from '@resumify/store'
import { THEME_PRESETS } from '@resumify/themes'
import { Header } from '@resumify/ui'
import { Separator } from '@shadcn/components/ui/separator'
import { useTranslations } from 'next-intl'

import { ExperienceHeaderSection } from './experience-header-section'
import { LayoutSection } from './layout-section'
import { PersonalInfoSection } from './personal-info-section'
import { PresetCard } from './previewers/preset'
import { TechStackSection } from './tech-stack-section'
import { TypographySection } from './typography-section'

export function ThemePanel() {
  const t = useTranslations()
  const store = useResumeStore()

  const currentTheme = resumeThemeGetter()
  const themeConfig = themeConfigGetter()

  const handlePresetChange = (presetId: string) => {
    store.selectPreset(presetId)
  }

  return (
    <div className="space-y-6">
      <Header
        title={t('theme.title')}
        subtitle={t('theme.subtitle')}
      />

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">{t('theme.select-preset')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEME_PRESETS.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              selected={currentTheme === preset.id}
              onClick={() => handlePresetChange(preset.id)}
            />
          ))}
        </div>
      </div>

      <Separator />

      <LayoutSection
        value={themeConfig.layout}
        onChange={value => store.updateThemeConfig('layout', value)}
      />

      <Separator />

      <PersonalInfoSection
        value={themeConfig.personalInfoLayout}
        onChange={value => store.updateThemeConfig('personalInfoLayout', value)}
      />

      <Separator />

      <ExperienceHeaderSection
        value={themeConfig.experienceHeaderLayout}
        onChange={value => store.updateThemeConfig('experienceHeaderLayout', value)}
      />

      <Separator />

      <TechStackSection
        value={themeConfig.techStackStyle}
        onChange={value => store.updateThemeConfig('techStackStyle', value)}
      />

      <Separator />

      <TypographySection
        value={themeConfig.typography}
        onChange={value => store.updateThemeConfig('typography', value)}
      />
    </div>
  )
}
