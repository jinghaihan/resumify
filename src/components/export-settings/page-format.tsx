'use client'

import type { PaperFormat } from '@resumify/shared'
import { PAPER_FORMAT_OPTIONS } from '@resumify/shared/constants'
import { Select } from '@resumify/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shadcn/components/ui/card'
import { Switch } from '@shadcn/components/ui/switch'
import { useTranslations } from 'next-intl'
import { Field } from './field'

interface PageFormatProps {
  format: PaperFormat
  landscape: boolean
  preferCSSPageSize: boolean
  onFormatChange: (format: PaperFormat) => void
  onLandscapeChange: (landscape: boolean) => void
  onPreferCSSPageSizeChange: (prefer: boolean) => void
}

export function PageFormat({
  format,
  landscape,
  preferCSSPageSize,
  onFormatChange,
  onLandscapeChange,
  onPreferCSSPageSizeChange,
}: PageFormatProps) {
  const t = useTranslations()

  const handleFormatChange = (value: PaperFormat) => {
    onFormatChange(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.page-format.title')}</CardTitle>
        <CardDescription>{t('settings.page-format.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label={t('settings.page-format.paper-size')}>
          <Select
            className="w-full"
            value={format}
            onValueChange={handleFormatChange}
            options={PAPER_FORMAT_OPTIONS}
          />
        </Field>

        <Field
          label={t('settings.page-format.landscape')}
          description={t('settings.page-format.landscape-description')}
          inline
        >
          <Switch
            checked={landscape}
            onCheckedChange={onLandscapeChange}
          />
        </Field>

        <Field
          label={t('settings.page-format.prefer-css-page-size')}
          description={t('settings.page-format.prefer-css-page-size-description')}
          inline
        >
          <Switch
            checked={preferCSSPageSize}
            onCheckedChange={onPreferCSSPageSizeChange}
          />
        </Field>
      </CardContent>
    </Card>
  )
}
