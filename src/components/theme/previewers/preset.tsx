'use client'

import type { ThemePreset } from '@resumify/shared'
import { SelectCard } from '../select-card'

interface PresetCardProps {
  preset: ThemePreset
  selected: boolean
  onClick: () => void
}

export function PresetCard({ preset, selected, onClick }: PresetCardProps) {
  return (
    <SelectCard selected={selected} onClick={onClick} showCheck>
      <div className="space-y-1">
        <div className="text-sm font-semibold">{preset.name}</div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          {preset.description}
        </div>
      </div>
    </SelectCard>
  )
}
