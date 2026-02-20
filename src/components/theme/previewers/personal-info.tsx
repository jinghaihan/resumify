'use client'

import type { PersonalInfoLayoutMode } from '@resumify/shared'
import { SelectCard } from '../select-card'

interface PersonalInfoPreviewerProps {
  layout: PersonalInfoLayoutMode
}

export function PersonalInfoPreviewer({ layout }: PersonalInfoPreviewerProps) {
  if (layout === 'stacked') {
    return (
      <div className="
        flex h-14 w-full flex-col justify-center gap-2 rounded-md border
        border-border bg-background p-2
      "
      >
        <div className="h-2 w-3/4 rounded-sm bg-muted" />
        <div className="h-2 w-1/2 rounded-sm bg-muted/60" />
      </div>
    )
  }

  if (layout === 'inline') {
    return (
      <div className="
        flex h-14 w-full items-center justify-center gap-2 rounded-md border
        border-border bg-background p-2
      "
      >
        <div className="h-2 w-1/4 rounded-sm bg-muted" />
        <div className="h-2 w-1/2 rounded-sm bg-muted/60" />
      </div>
    )
  }

  return null
}

interface PersonalInfoCardProps {
  layout: PersonalInfoLayoutMode
  label: string
  selected: boolean
  onClick: () => void
}

export function PersonalInfoCard({ layout, label, selected, onClick }: PersonalInfoCardProps) {
  return (
    <SelectCard selected={selected} onClick={onClick} showCheck>
      <PersonalInfoPreviewer layout={layout} />
      <div className="text-center text-sm font-medium">{label}</div>
    </SelectCard>
  )
}
