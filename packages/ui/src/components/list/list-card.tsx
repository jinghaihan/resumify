import type { MouseEvent } from 'react'
import { cn } from '@resumify/shared'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shadcn/components/ui/card'

interface ListCardProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  content?: React.ReactNode
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
  className?: string
}

export function ListCard({
  title,
  subtitle,
  actions,
  content,
  onClick,
  className,
}: ListCardProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (onClick)
      onClick(e)
  }

  return (
    <Card className={cn('py-3 pl-2', className)} onClick={handleClick}>
      <CardHeader>
        <CardTitle className="truncate whitespace-nowrap">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        {actions && (
          <CardAction
            className="text-muted-foreground"
            onClick={e => e.stopPropagation()}
          >
            {actions}
          </CardAction>
        )}
      </CardHeader>
      {content && <CardContent>{content}</CardContent>}
    </Card>
  )
}
