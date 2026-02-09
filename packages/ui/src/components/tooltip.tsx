import type { ComponentProps, ReactElement, ReactNode } from 'react'
import {
  TooltipContent,
  TooltipProvider,
  Tooltip as TooltipRoot,
  TooltipTrigger,
} from '@shadcn/components/ui/tooltip'

interface TooltipProps {
  content: ReactNode
  children: ReactElement
  side?: ComponentProps<typeof TooltipContent>['side']
  sideOffset?: ComponentProps<typeof TooltipContent>['sideOffset']
  delayDuration?: number
  disabled?: boolean
  className?: string
}

export function Tooltip({
  content,
  children,
  side,
  sideOffset,
  delayDuration,
  disabled = false,
  className,
}: TooltipProps) {
  if (disabled)
    return children

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={sideOffset} className={className}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}
