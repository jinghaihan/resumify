'use client'

import type { ReactNode } from 'react'
import { cn } from '@resumify/shared'
import { CircleCheckIcon } from 'lucide-react'

interface SelectCardProps {
  children: ReactNode
  selected: boolean
  onClick: () => void
  showCheck?: boolean
}

export function SelectCard({ children, selected, onClick, showCheck }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        `
          relative flex flex-col gap-3 rounded-lg border-2 p-4 text-left
          transition-all
        `,
        selected
          ? 'border-primary'
          : `
            border-border
            hover:border-primary/70
          `,
      )}
    >
      {showCheck && selected && (
        <div className="absolute top-2 right-2 text-primary">
          <CircleCheckIcon className="size-5" />
        </div>
      )}
      {children}
    </button>
  )
}
