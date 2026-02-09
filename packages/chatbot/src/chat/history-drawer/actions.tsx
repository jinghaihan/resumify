'use client'

import type { ModalRef } from '@resumify/ui'
import type { ChatHistorySummary } from '../../storage'
import { Confirm, IconButton, Modal } from '@resumify/ui'
import { Input } from '@shadcn/components/ui/input'
import { EditIcon, RotateCcwIcon, Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { renameChatHistory } from '../../storage'

interface HistoryDrawerActionsProps {
  item: ChatHistorySummary
  onRestore: (id: string) => void
  onDelete: (item: ChatHistorySummary) => void
  onRenameUpdated: (item: ChatHistorySummary) => void
}

export function HistoryDrawerActions({
  item,
  onRestore,
  onDelete,
  onRenameUpdated,
}: HistoryDrawerActionsProps) {
  const t = useTranslations()
  const renameRef = useRef<ModalRef | null>(null)
  const [renameValue, setRenameValue] = useState(item.title)

  const handleRenameOpen = useCallback(() => {
    setRenameValue(item.title)
    renameRef.current?.open()
  }, [item.title])

  const handleRenameConfirm = useCallback(() => {
    const nextTitle = renameValue.trim()
    if (!nextTitle) {
      toast.error(t('chat.history-title-required'))
      return
    }
    return (async () => {
      try {
        const updated = await renameChatHistory(item.id, nextTitle)
        if (updated)
          onRenameUpdated(updated)
        toast.success(t('chat.history-renamed'))
      }
      catch {
        toast.error(t('status.error'))
      }
    })()
  }, [item.id, onRenameUpdated, renameValue, t])

  return (
    <div className="flex items-center gap-1">
      <IconButton
        icon={<RotateCcwIcon className="size-3.5" />}
        size="icon-xs"
        title={t('chat.history-restore')}
        onClick={() => onRestore(item.id)}
      />
      <IconButton
        icon={<EditIcon className="size-3.5" />}
        size="icon-xs"
        title={t('chat.history-rename')}
        onClick={handleRenameOpen}
      />
      <Confirm
        title={t('confirm.chat-history-delete.title')}
        description={t('confirm.chat-history-delete.description')}
        onConfirm={() => onDelete(item)}
      >
        <IconButton
          icon={<Trash2Icon className="size-3.5" />}
          size="icon-xs"
          title={t('chat.history-delete')}
        />
      </Confirm>

      <Modal
        ref={renameRef}
        title={t('chat.history-rename-title')}
        description={t('chat.history-rename-description')}
        confirmText={t('chat.history-rename')}
        onConfirm={handleRenameConfirm}
        trigger={<span className="hidden" />}
      >
        <Input
          value={renameValue}
          onChange={event => setRenameValue(event.target.value)}
          placeholder={t('chat.history-rename-placeholder')}
        />
      </Modal>
    </div>
  )
}
