'use client'
import type { AtomicThemeConfig } from '@resumify/shared'
import { LAYOUT_MODES, THEME_LABELS } from '@resumify/themes'
import { useTranslations } from 'next-intl'

import { LayoutCard } from './previewers'

interface LayoutSectionProps {
  value: AtomicThemeConfig['layout']
  onChange: (value: AtomicThemeConfig['layout']) => void
}

export function LayoutSection({ value, onChange }: LayoutSectionProps) {
  const t = useTranslations()

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{t('theme.layout-mode')}</h3>
      <div className="grid grid-cols-3 gap-3">
        {LAYOUT_MODES.map(layout => (
          <LayoutCard
            key={layout}
            layout={layout}
            label={t(THEME_LABELS.layout[layout])}
            selected={value === layout}
            onClick={() => onChange(layout)}
          />
        ))}
      </div>
    </div>
  )
}
