'use client'

import type { Skill } from '@resumify/shared'
import type { SortableCardProps } from '@resumify/ui'
import { SortableCard } from '@resumify/ui'
import { Textarea } from '@shadcn/components/ui/textarea'
import { useTranslations } from 'next-intl'

type CustomSectionProps = {
  content: string
  onChange: (updates: Partial<Skill>) => void
} & Omit<SortableCardProps, 'children'>

export function CustomSection({
  content,
  onChange,
  dragHandle,
  deleteButton,
  ...props
}: CustomSectionProps) {
  const t = useTranslations()
  return (
    <SortableCard {...props} dragHandle={dragHandle} deleteButton={deleteButton}>
      <Textarea
        placeholder={t('custom-section.placeholder')}
        value={content}
        onChange={e => onChange({ content: e.target.value })}
      />
    </SortableCard>
  )
}
