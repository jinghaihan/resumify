'use client'
import type { AtomicThemeConfig } from '@resumify/shared'
import { PERSONAL_INFO_LAYOUT_MODES, THEME_LABELS } from '@resumify/themes'
import { useTranslations } from 'next-intl'

import { PersonalInfoCard } from './previewers'

interface PersonalInfoSectionProps {
  value: AtomicThemeConfig['personalInfoLayout']
  onChange: (value: AtomicThemeConfig['personalInfoLayout']) => void
}

export function PersonalInfoSection({ value, onChange }: PersonalInfoSectionProps) {
  const t = useTranslations()

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{t('theme.personal-info-layout')}</h3>
      <div className="grid grid-cols-2 gap-3">
        {PERSONAL_INFO_LAYOUT_MODES.map(layout => (
          <PersonalInfoCard
            key={layout}
            layout={layout}
            label={t(THEME_LABELS.personalInfoLayout[layout])}
            selected={value === layout}
            onClick={() => onChange(layout)}
          />
        ))}
      </div>
    </div>
  )
}
