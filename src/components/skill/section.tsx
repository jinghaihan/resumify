'use client'

import type { Skill } from '@resumify/shared'
import type { SortableCardProps } from '@resumify/ui'
import { SortableCard } from '@resumify/ui'
import { Textarea } from '@shadcn/components/ui/textarea'
import { useTranslations } from 'next-intl'

type SkillSectionProps = {
  content: string
  onChange: (updates: Partial<Skill>) => void
} & Omit<SortableCardProps, 'children'>

export function SkillSection({
  content,
  onChange,
  dragHandle,
  deleteButton,
  ...props
}: SkillSectionProps) {
  const t = useTranslations()
  return (
    <SortableCard {...props} dragHandle={dragHandle} deleteButton={deleteButton}>
      <Textarea
        placeholder={t('skills.placeholder')}
        value={content}
        onChange={e => onChange({ content: e.target.value })}
      />
    </SortableCard>
  )
}
