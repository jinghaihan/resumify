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

interface AccessibilityProps {
  tagged: boolean
  outline: boolean
  onTaggedChange: (value: boolean) => void
  onOutlineChange: (value: boolean) => void
}

export function Accessibility({
  tagged,
  outline,
  onTaggedChange,
  onOutlineChange,
}: AccessibilityProps) {
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.accessibility.title')}</CardTitle>
        <CardDescription>{t('settings.accessibility.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field
          label={t('settings.accessibility.tagged')}
          description={t('settings.accessibility.tagged-description')}
          inline
        >
          <Switch
            checked={tagged}
            onCheckedChange={onTaggedChange}
          />
        </Field>

        <Field
          label={t('settings.accessibility.outline')}
          description={t('settings.accessibility.outline-description')}
          inline
        >
          <Switch
            checked={outline}
            onCheckedChange={onOutlineChange}
          />
        </Field>
      </CardContent>
    </Card>
  )
}
