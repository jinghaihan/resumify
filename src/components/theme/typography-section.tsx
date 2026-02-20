'use client'

import type { AtomicThemeConfig } from '@resumify/shared'
import { THEME_LABELS, TYPOGRAPHIES } from '@resumify/themes'
import { Select } from '@resumify/ui'
import { useTranslations } from 'next-intl'

interface TypographySectionProps {
  value: AtomicThemeConfig['typography']
  onChange: (value: AtomicThemeConfig['typography']) => void
}

export function TypographySection({ value, onChange }: TypographySectionProps) {
  const t = useTranslations()

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t('theme.typography')}</h3>
      <Select
        className="w-full"
        value={value}
        onValueChange={onChange}
        options={TYPOGRAPHIES.map(typography => ({
          value: typography,
          label: t(THEME_LABELS.typography[typography]),
        }))}
      />
    </div>
  )
}
