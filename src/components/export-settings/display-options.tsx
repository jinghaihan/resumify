'use client'
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

interface DisplayOptionsProps {
  printBackground: boolean
  omitBackground: boolean
  displayHeaderFooter: boolean
  onPrintBackgroundChange: (value: boolean) => void
  onOmitBackgroundChange: (value: boolean) => void
  onDisplayHeaderFooterChange: (value: boolean) => void
}

export function DisplayOptions({
  printBackground,
  omitBackground,
  displayHeaderFooter,
  onPrintBackgroundChange,
  onOmitBackgroundChange,
  onDisplayHeaderFooterChange,
}: DisplayOptionsProps) {
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.display-options.title')}</CardTitle>
        <CardDescription>{t('settings.display-options.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field
          label={t('settings.display-options.print-background')}
          description={t('settings.display-options.print-background-description')}
          inline
        >
          <Switch
            checked={printBackground}
            onCheckedChange={onPrintBackgroundChange}
          />
        </Field>

        <Field
          label={t('settings.display-options.omit-background')}
          description={t('settings.display-options.omit-background-description')}
          inline
        >
          <Switch
            checked={omitBackground}
            onCheckedChange={onOmitBackgroundChange}
          />
        </Field>

        <Field
          label={t('settings.display-options.display-header-footer')}
          description={t('settings.display-options.display-header-footer-description')}
          inline
        >
          <Switch
            checked={displayHeaderFooter}
            onCheckedChange={onDisplayHeaderFooterChange}
          />
        </Field>
      </CardContent>
    </Card>
  )
}
