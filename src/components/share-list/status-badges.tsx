import type { DatabaseShareListItem } from '@resumify/database'
import { isExpired } from '@resumify/shared'
import { Badge } from '@shadcn/components/ui/badge'
import { useTranslations } from 'next-intl'

interface StatusBadgesProps {
  share: DatabaseShareListItem
}

export function StatusBadges({ share }: StatusBadgesProps) {
  const t = useTranslations()

  const expired = share.expiresAt ? isExpired(share.expiresAt.toString()) : false

  return (
    <div className="flex items-center gap-1">
      {share.isOneTime && (
        <Badge variant="outline">
          {t('share-list.status.one-time')}
        </Badge>
      )}
      {share.isActive
        ? (
            <Badge variant="outline">
              {t('share-list.status.active')}
            </Badge>
          )
        : (
            <Badge variant="outline">
              {t('share-list.status.stopped')}
            </Badge>
          )}
      {expired && (
        <Badge variant="outline">
          {t('share-list.status.expired')}
        </Badge>
      )}
    </div>
  )
}
