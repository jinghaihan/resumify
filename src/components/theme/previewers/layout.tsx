'use client'
import type { LayoutMode } from '@resumify/shared'

import { SelectCard } from '../select-card'

interface LayoutPreviewerProps {
  layout: LayoutMode
}

export function LayoutPreviewer({ layout }: LayoutPreviewerProps) {
  if (layout === 'single') {
    return (
      <div className="flex h-16 w-full items-center justify-center gap-1 p-2">
        <div className="
          h-10 w-full rounded border-2 border-border bg-background
        "
        />
      </div>
    )
  }

  if (layout === 'double') {
    return (
      <div className="flex h-16 w-full gap-1 p-2">
        <div className="h-full w-[30%] rounded-md bg-muted" />
        <div className="
          h-full w-[68%] rounded-md border-2 border-border bg-background
        "
        />
      </div>
    )
  }

  if (layout === 'reversed-double') {
    return (
      <div className="flex h-16 w-full gap-1 p-2">
        <div className="
          h-full w-[68%] rounded-md border-2 border-border bg-background
        "
        />
        <div className="h-full w-[30%] rounded-md bg-muted" />
      </div>
    )
  }

  return null
}

interface LayoutCardProps {
  layout: LayoutMode
  label: string
  selected: boolean
  onClick: () => void
}

export function LayoutCard({ layout, label, selected, onClick }: LayoutCardProps) {
  return (
    <SelectCard selected={selected} onClick={onClick} showCheck>
      <LayoutPreviewer layout={layout} />
      <div className="text-center text-sm font-medium">{label}</div>
    </SelectCard>
  )
}
