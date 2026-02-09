'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shadcn/components/ui/card'
import { Input } from '@shadcn/components/ui/input'
import { useTranslations } from 'next-intl'

import { Field } from './field'

interface MarginsProps {
  margin: {
    top?: string | number
    right?: string | number
    bottom?: string | number
    left?: string | number
  }
  onMarginChange: (margin: Partial<{
    top?: string | number
    right?: string | number
    bottom?: string | number
    left?: string | number
  }>) => void
}

export function Margins({ margin, onMarginChange }: MarginsProps) {
  const t = useTranslations()

  const parseMarginValue = (value: string | number | undefined): number => {
    if (typeof value === 'number')
      return value
    if (!value)
      return 0
    return Number.parseFloat(value.toString().replace(/[^\d.]/g, '')) || 0
  }

  const handleMarginChange = (side: 'top' | 'right' | 'bottom' | 'left', value: string) => {
    const numValue = Number.parseFloat(value) || 0
    onMarginChange({ [side]: `${numValue}in` })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.margins.title')}</CardTitle>
        <CardDescription>{t('settings.margins.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('settings.margins.top')}>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={parseMarginValue(margin.top)}
              onChange={e => handleMarginChange('top', e.target.value)}
              placeholder="0.4"
            />
          </Field>

          <Field label={t('settings.margins.bottom')}>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={parseMarginValue(margin.bottom)}
              onChange={e => handleMarginChange('bottom', e.target.value)}
              placeholder="0.4"
            />
          </Field>

          <Field label={t('settings.margins.left')}>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={parseMarginValue(margin.left)}
              onChange={e => handleMarginChange('left', e.target.value)}
              placeholder="0.4"
            />
          </Field>

          <Field label={t('settings.margins.right')}>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={parseMarginValue(margin.right)}
              onChange={e => handleMarginChange('right', e.target.value)}
              placeholder="0.4"
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}
