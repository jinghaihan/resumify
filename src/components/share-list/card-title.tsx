import type { DatabaseShareListItem } from '@resumify/database'

interface CardTitleProps {
  share: DatabaseShareListItem
}

export function CardTitle({ share }: CardTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <span>{share.shareName}</span>
    </div>
  )
}
