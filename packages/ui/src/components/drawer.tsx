'use client'

import { cn } from '@resumify/shared'
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  Drawer as DrawerPrimitive,
  DrawerTitle,
  DrawerTrigger,
} from '@shadcn/components/ui/drawer'

interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  direction?: 'left' | 'right' | 'top' | 'bottom'
  modal?: boolean
  dismissible?: boolean
  shouldScaleBackground?: boolean
  title?: string
  description?: string
  trigger?: React.ReactNode
  children: React.ReactNode
  contentClassName?: string
  headerClassName?: string
}

export function Drawer({
  title,
  description,
  trigger,
  children,
  contentClassName,
  headerClassName,
  ...props
}: DrawerProps) {
  return (
    <DrawerPrimitive {...props}>
      {trigger && (
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
      )}
      <DrawerContent className={cn(contentClassName)}>
        {(title || description) && (
          <DrawerHeader className={headerClassName}>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        {children}
      </DrawerContent>
    </DrawerPrimitive>
  )
}
