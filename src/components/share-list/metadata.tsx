import type { DatabaseShareListItem } from '@resumify/database'
import { formatDateTime } from '@resumify/shared'
import { useTranslations } from 'next-intl'

interface MetadataProps {
  share: DatabaseShareListItem
}

export function Metadata({ share }: MetadataProps) {
  const t = useTranslations()

  return (
    <>
      <span className="text-muted-foreground">
        {t('share-list.original-resume')}
        :
        {' '}
        {share.resumeName}
      </span>
      <div className="flex justify-between text-muted-foreground">
        <span>{formatDateTime(share.createdAt ? new Date(share.createdAt) : new Date())}</span>
        <span>
          {share.viewCount}
          {' '}
          {t('share-list.view-count')}
        </span>
      </div>
    </>
  )
}
