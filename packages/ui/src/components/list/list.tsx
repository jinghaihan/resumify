import type { MouseEvent } from 'react'
import { Result } from '../result'
import { ListCard } from './list-card'

interface ListProps<T extends { id: string }> {
  items: T[]
  title: (item: T) => React.ReactNode
  actions?: (item: T) => React.ReactNode
  subtitle?: (item: T) => React.ReactNode
  content?: (item: T) => React.ReactNode
  onClick?: (item: T, e: MouseEvent<HTMLDivElement>) => void
  cardClassName?: string
}

export function List<T extends { id: string }>({
  items,
  title,
  actions,
  subtitle,
  content,
  onClick,
  cardClassName,
}: ListProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && <Result status="empty" />}
      {items.map(item => (
        <ListCard
          key={item.id}
          title={title(item)}
          subtitle={subtitle?.(item)}
          actions={actions?.(item)}
          content={content?.(item)}
          onClick={onClick ? e => onClick(item, e) : undefined}
          className={cardClassName}
        />
      ))}
    </div>
  )
}
