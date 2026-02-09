'use client'
import type { PersonalInfo } from '@resumify/shared'
import { IconPicker } from '@resumify/ui'
import { Input } from '@shadcn/components/ui/input'
import { useTranslations } from 'next-intl'

interface PersonalInfoSectionProps {
  icon: string
  name: string
  value: string
  dragHandle: React.ReactNode
  deleteButton: React.ReactNode
  onChange: (updates: Partial<PersonalInfo>) => void
}

export function PersonalInfoSection({
  icon,
  name,
  value,
  dragHandle,
  deleteButton,
  onChange,
}: PersonalInfoSectionProps) {
  const t = useTranslations()
  return (
    <div className="flex items-center rounded-lg border border-border p-2">
      <div className="flex items-center">
        {dragHandle}
        <IconPicker
          className="-ml-1"
          icon={icon}
          onConfirm={icon => onChange({ icon })}
        />
      </div>
      <div className="flex items-center gap-2 px-1">
        <Input
          placeholder={t('field.label')}
          className="w-1/3 min-w-0"
          value={name}
          onChange={e => onChange({ name: e.target.value })}
        />
        <Input
          placeholder={t('field.value')}
          className="w-2/3 min-w-0"
          value={value}
          onChange={e => onChange({ value: e.target.value })}
        />
      </div>
      {deleteButton}
    </div>
  )
}
