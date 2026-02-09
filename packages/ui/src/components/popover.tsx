import type { ComponentProps, ReactElement, ReactNode } from 'react'
import {
  PopoverContent,
  Popover as PopoverRoot,
  PopoverTrigger,
} from '@shadcn/components/ui/popover'

type PopoverProps = {
  trigger: ReactElement
  content: ReactNode
  align?: ComponentProps<typeof PopoverContent>['align']
  sideOffset?: ComponentProps<typeof PopoverContent>['sideOffset']
  contentClassName?: string
  preventAutoFocus?: boolean
} & ComponentProps<typeof PopoverRoot>

export function Popover({
  trigger,
  content,
  align,
  sideOffset,
  contentClassName,
  preventAutoFocus = false,
  ...props
}: PopoverProps) {
  return (
    <PopoverRoot {...props}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        className={contentClassName}
        onOpenAutoFocus={(event) => {
          if (preventAutoFocus)
            event.preventDefault()
        }}
      >
        {content}
      </PopoverContent>
    </PopoverRoot>
  )
}
