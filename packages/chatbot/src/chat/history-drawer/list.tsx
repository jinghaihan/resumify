'use client'

import type { ChatHistorySummary } from '../../storage'
import { formatDateTime } from '@resumify/shared'
import { List, Result } from '@resumify/ui'
import { useTranslations } from 'next-intl'
import { HistoryDrawerActions } from './actions'

interface HistoryDrawerListProps {
  loading: boolean
  items: ChatHistorySummary[]
  activeId: string | null
  onRestore: (id: string) => void
  onDelete: (item: ChatHistorySummary) => void
  onRenameUpdated: (item: ChatHistorySummary) => void
}

export function HistoryDrawerList({
  loading,
  items,
  activeId,
  onRestore,
  onDelete,
  onRenameUpdated,
}: HistoryDrawerListProps) {
  const t = useTranslations()

  if (loading)
    return <Result status="loading" className="py-6" />

  return (
    <List
      items={items}
      title={item => item.title}
      subtitle={(item) => {
        const updatedAt = formatDateTime(new Date(item.updatedAt))
        if (item.id === activeId)
          return `${t('chat.history-current')} · ${updatedAt}`
        return updatedAt
      }}
      content={item => (
        <span className="text-xs text-muted-foreground">
          {t('chat.history-messages', { count: item.messageCount })}
        </span>
      )}
      actions={item => (
        <HistoryDrawerActions
          item={item}
          onRestore={onRestore}
          onDelete={onDelete}
          onRenameUpdated={onRenameUpdated}
        />
      )}
      onClick={item => onRestore(item.id)}
    />
  )
}
