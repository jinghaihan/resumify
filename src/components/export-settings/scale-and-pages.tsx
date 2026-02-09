'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shadcn/components/ui/card'
import { Input } from '@shadcn/components/ui/input'
import { Label } from '@shadcn/components/ui/label'
import { Slider } from '@shadcn/components/ui/slider'
import { useTranslations } from 'next-intl'

import { Field } from './field'

interface PageRange {
  start?: number
  end?: number
}

interface ScaleAndPagesProps {
  scale: number
  pageRanges: PageRange
  onScaleChange: (scale: number) => void
  onPageRangeChange: (pageRange: Partial<PageRange>) => void
}

const PDF_SCALE = {
  MIN: 0.1,
  MAX: 2,
  STEP: 0.1,
}

export function ScaleAndPages({
  scale,
  pageRanges,
  onScaleChange,
  onPageRangeChange,
}: ScaleAndPagesProps) {
  const t = useTranslations()

  const handleScaleInputChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!Number.isNaN(numValue)) {
      const clampedValue = Math.max(PDF_SCALE.MIN, Math.min(PDF_SCALE.MAX, numValue))
      onScaleChange(clampedValue)
    }
  }

  const handlePageRangeChange = (field: 'start' | 'end', value: string) => {
    const numValue = value === '' ? undefined : Number.parseInt(value, 10)
    if (value === '' || (!Number.isNaN(numValue) && numValue !== undefined && numValue > 0))
      onPageRangeChange({ [field]: numValue })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.scale-and-pages.title')}</CardTitle>
        <CardDescription>{t('settings.scale-and-pages.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {`${t('settings.scale-and-pages.scale')}: ${scale.toFixed(1)}`}
            </Label>
            <span className="text-xs text-muted-foreground">
              {`${t('settings.scale-and-pages.range')}: ${PDF_SCALE.MIN} - ${PDF_SCALE.MAX}`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              min={PDF_SCALE.MIN}
              max={PDF_SCALE.MAX}
              step={PDF_SCALE.STEP}
              value={[scale]}
              onValueChange={value => onScaleChange(Array.isArray(value) ? value[0] : value)}
              className="flex-1"
            />
            <Input
              type="number"
              min={PDF_SCALE.MIN}
              max={PDF_SCALE.MAX}
              step={PDF_SCALE.STEP}
              value={scale}
              onChange={e => handleScaleInputChange(e.target.value)}
              className="w-20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('settings.scale-and-pages.page-ranges')}</Label>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('settings.scale-and-pages.start-page')}>
              <Input
                type="number"
                min="1"
                step="1"
                value={pageRanges.start ?? ''}
                onChange={e => handlePageRangeChange('start', e.target.value)}
                placeholder="1"
              />
            </Field>
            <Field label={t('settings.scale-and-pages.end-page')}>
              <Input
                type="number"
                min="1"
                step="1"
                value={pageRanges.end ?? ''}
                onChange={e => handlePageRangeChange('end', e.target.value)}
                placeholder="All"
              />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('settings.scale-and-pages.leave-empty-tip')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
