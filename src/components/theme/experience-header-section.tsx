'use client'

import type { AtomicThemeConfig } from '@resumify/shared'
import { EXPERIENCE_HEADER_LAYOUT_MODES, THEME_LABELS } from '@resumify/themes'
import { Select } from '@resumify/ui'
import { useTranslations } from 'next-intl'

interface ExperienceHeaderSectionProps {
  value: AtomicThemeConfig['experienceHeaderLayout']
  onChange: (value: AtomicThemeConfig['experienceHeaderLayout']) => void
}

export function ExperienceHeaderSection({ value, onChange }: ExperienceHeaderSectionProps) {
  const t = useTranslations()

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t('theme.experience-header-layout')}</h3>
      <Select
        className="w-full"
        value={value}
        onValueChange={onChange}
        options={EXPERIENCE_HEADER_LAYOUT_MODES.map(layout => ({
          value: layout,
          label: t(THEME_LABELS.experienceHeaderLayout[layout]),
        }))}
      />
    </div>
  )
}
