'use client'
import type { WorkExperience } from '@resumify/shared'
import type { SortableCardProps } from '@resumify/ui'
import { SortableCard } from '@resumify/ui'
import { Input } from '@shadcn/components/ui/input'
import { Label } from '@shadcn/components/ui/label'
import { Textarea } from '@shadcn/components/ui/textarea'
import { useTranslations } from 'next-intl'

export type WorkExperienceSectionProps = {
  nameLabel?: string
  name: string
  roleLabel?: string
  role: string
  startDate: string
  endDate: string
  description: string
  achievements: string
  onChange: (updates: Partial<WorkExperience>) => void
  footer?: React.ReactNode
} & Omit<SortableCardProps, 'children'>

export function WorkExperienceSection({
  nameLabel,
  name,
  roleLabel,
  role,
  startDate,
  endDate,
  description,
  achievements,
  footer,
  onChange,
  dragHandle,
  deleteButton,
  ...props
}: WorkExperienceSectionProps) {
  const t = useTranslations()
  return (
    <SortableCard {...props} dragHandle={dragHandle} deleteButton={deleteButton}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{nameLabel || t('work-experience.name')}</Label>
            <Input
              value={name}
              onChange={e => onChange({ name: e.target.value })}
              placeholder={t('work-experience.name')}
            />
          </div>
          <div className="space-y-2">
            <Label>{roleLabel || t('work-experience.role')}</Label>
            <Input
              value={role}
              onChange={e => onChange({ role: e.target.value })}
              placeholder={t('work-experience.role')}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('field.startDate')}</Label>
            <Input
              value={startDate}
              onChange={e => onChange({ startDate: e.target.value })}
              placeholder={t('field.startDate')}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('field.endDate')}</Label>
            <Input
              value={endDate}
              onChange={e => onChange({ endDate: e.target.value })}
              placeholder={t('field.endDate')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('field.description')}</Label>
          <Textarea
            value={description}
            onChange={e => onChange({ description: e.target.value })}
            placeholder={t('field.description')}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('field.achievements')}</Label>
          <Textarea
            value={achievements}
            onChange={e => onChange({ achievements: e.target.value })}
            placeholder={t('field.achievements')}
          />
        </div>

        {footer}
      </div>
    </SortableCard>
  )
}
