'use client'
import type { AtomicThemeConfig } from '@resumify/shared'
import {
  TECH_STACK_BACKGROUNDS,
  TECH_STACK_SHAPES,
  THEME_LABELS,
} from '@resumify/themes'
import { Select } from '@resumify/ui'
import { useTranslations } from 'next-intl'

interface TechStackSectionProps {
  value: AtomicThemeConfig['techStackStyle']
  onChange: (value: AtomicThemeConfig['techStackStyle']) => void
}

interface SelectOption { label: string, value: string }

export function TechStackSection({ value, onChange }: TechStackSectionProps) {
  const t = useTranslations()

  const backgroundOptionsWithLabel: SelectOption[] = TECH_STACK_BACKGROUNDS.map(bg => ({
    value: bg,
    label: t(THEME_LABELS.techStackBackground[bg]),
  }))

  const shapeOptionsWithLabel: SelectOption[] = TECH_STACK_SHAPES.map(shape => ({
    value: shape,
    label: t(THEME_LABELS.techStackShape[shape]),
  }))

  const handleBackgroundChange = (background: AtomicThemeConfig['techStackStyle']['background']) => {
    onChange({
      ...value,
      background,
    })
  }

  const handleShapeChange = (shape: AtomicThemeConfig['techStackStyle']['shape']) => {
    onChange({
      ...value,
      shape,
    })
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t('theme.tech-stack-style')}</h3>
      <div className="grid grid-cols-2 gap-2">
        <Select
          className="w-full"
          value={value.background}
          onValueChange={handleBackgroundChange}
          options={backgroundOptionsWithLabel}
        />
        <Select
          className="w-full"
          value={value.shape}
          onValueChange={handleShapeChange}
          options={shapeOptionsWithLabel}
        />
      </div>
    </div>
  )
}
