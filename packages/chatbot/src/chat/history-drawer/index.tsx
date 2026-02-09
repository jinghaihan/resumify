'use client'

import type { UIMessage } from 'ai'
import type { ChatHistorySummary } from '../../storage'
import { Drawer, IconButton } from '@resumify/ui'
import { HistoryIcon, PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { deleteChatHistory, listChatHistories, loadChatHistory } from '../../storage'
import { HistoryDrawerList } from './list'

interface ChatHistoryDrawerProps {
  onRestore: (messages: UIMessage[]) => void
  onActiveChange: (id: string | null) => void
  activeId: string | null
}

export function ChatHistoryDrawer({
  onRestore,
  onActiveChange,
  activeId,
}: ChatHistoryDrawerProps) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ChatHistorySummary[]>([])

  const loadHistoryList = useCallback(async () => {
    setLoading(true)
    try {
      const histories = await listChatHistories()
      setItems(histories)
    }
    catch {
      toast.error(t('status.error'))
    }
    finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    if (!open)
      return
    void loadHistoryList()
  }, [open, loadHistoryList])

  const handleRestore = useCallback(async (id: string) => {
    try {
      const history = await loadChatHistory(id)
      if (!history || history.length === 0) {
        toast.error(t('chat.history-empty'))
        return
      }
      onActiveChange(id)
      onRestore(history)
      setOpen(false)
      toast.success(t('chat.history-restored'))
    }
    catch {
      toast.error(t('status.error'))
    }
  }, [onActiveChange, onRestore, t])

  const handleDelete = useCallback(async (item: ChatHistorySummary) => {
    try {
      await deleteChatHistory(item.id)
      setItems(prev => prev.filter(history => history.id !== item.id))
      if (activeId === item.id) {
        onActiveChange(null)
        onRestore([])
      }
      toast.success(t('chat.history-deleted'))
    }
    catch {
      toast.error(t('status.error'))
    }
  }, [activeId, onActiveChange, onRestore, t])

  const handleRenameUpdated = useCallback((updated: ChatHistorySummary) => {
    setItems(prev => prev.map(history => history.id === updated.id ? updated : history))
  }, [])

  const handleNewChat = useCallback(() => {
    onActiveChange(null)
    onRestore([])
    setOpen(false)
  }, [onActiveChange, onRestore])

  return (
    <div className="flex items-center">
      <IconButton
        icon={<PlusIcon />}
        title={t('chat.history-new')}
        onClick={handleNewChat}
      />

      <Drawer
        open={open}
        onOpenChange={setOpen}
        direction="right"
        title={t('chat.history-title')}
        description={t('chat.history-description')}
        contentClassName="flex w-[90vw] flex-col sm:max-w-md"
        trigger={(
          <IconButton
            icon={<HistoryIcon />}
            title={t('chat.history-open')}
          />
        )}
      >
        <div className="flex-1 overflow-y-auto p-4">
          <HistoryDrawerList
            loading={loading}
            items={items}
            activeId={activeId}
            onRestore={handleRestore}
            onDelete={handleDelete}
            onRenameUpdated={handleRenameUpdated}
          />
        </div>
      </Drawer>
    </div>
  )
}
