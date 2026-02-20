import type { DatabaseShareListItem } from '@resumify/database'
import type { ModalRef } from '@resumify/ui'
import { deleteShare, toggleShareActive } from '@resumify/api'
import { isExpired, useClipboard } from '@resumify/shared'
import { Confirm, IconButton } from '@resumify/ui'
import {
  CheckIcon,
  CopyIcon,
  EditIcon,
  PlayIcon,
  QrCodeIcon,
  StopCircleIcon,
  Trash2Icon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { QRCodeModal } from './qr-code-modal'
import { ShareFormModal } from './share-form-modal'

interface CardActionsProps {
  share: DatabaseShareListItem
  fetchShares: () => Promise<void>
}

export function CardActions({
  share,
  fetchShares,
}: CardActionsProps) {
  const t = useTranslations()
  const [copy, copied] = useClipboard()
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null)
  const [selectedShare, setSelectedShare] = useState<DatabaseShareListItem | null>(null)
  const [editingShare, setEditingShare] = useState<DatabaseShareListItem | null>(null)
  const [togglingShareId, setTogglingShareId] = useState<string | null>(null)

  const editModalRef = useRef<ModalRef>(null)

  const expired = share.expiresAt ? isExpired(share.expiresAt.toString()) : false
  const notAccessible = !share.isActive || expired
  const isLoading = togglingShareId === share.id

  const openQRCodeModal = useCallback(() => {
    setSelectedShare(share)
  }, [share])

  const openEditModal = useCallback(() => {
    setEditingShare(share)
  }, [share])

  useEffect(() => {
    if (editingShare && editModalRef.current)
      editModalRef.current.open()
  }, [editingShare])

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/share/${share.token}`
    copy(url)
    setCopiedShareId(share.id)
  }, [share, copy])

  const handleToggle = useCallback(async () => {
    try {
      setTogglingShareId(share.id)
      await toggleShareActive(share.id)
      await fetchShares()
      toast.success(t('message.export-success'))
    }
    catch {
      toast.error(t('message.export-failed'))
    }
    finally {
      setTogglingShareId(null)
    }
  }, [share, fetchShares, t])

  const handleDelete = useCallback(async () => {
    try {
      await deleteShare(share.id)
      await fetchShares()
      toast.success(t('message.export-success'))
    }
    catch {
      toast.error(t('message.export-failed'))
    }
  }, [share, fetchShares, t])

  const isCopied = copiedShareId === share.id && copied

  return (
    <>
      <div className="flex items-center">
        <IconButton
          icon={isCopied
            ? <CheckIcon className="size-3.5" />
            : <CopyIcon className="size-3.5" />}
          title={t('button.copy')}
          onClick={handleCopyLink}
          disabled={isLoading || notAccessible}
          tooltipSide="top"
        />
        <IconButton
          icon={<QrCodeIcon className="size-3.5" />}
          title={t('share-list.qr-code')}
          onClick={openQRCodeModal}
          disabled={isLoading || notAccessible}
          tooltipSide="top"
        />
        <IconButton
          icon={<EditIcon className="size-3.5" />}
          title={t('button.edit')}
          onClick={openEditModal}
          disabled={isLoading || notAccessible}
          tooltipSide="top"
        />
        <IconButton
          icon={share.isActive
            ? <StopCircleIcon className="size-3.5" />
            : <PlayIcon className="size-3.5" />}
          title={share.isActive ? t('button.stop') : t('button.resume')}
          onClick={handleToggle}
          loading={togglingShareId === share.id}
          tooltipSide="top"
        />
        <Confirm
          title={t('share-list.delete-confirm.title')}
          description={t('share-list.delete-confirm.description')}
          onConfirm={handleDelete}
        >
          <IconButton
            icon={<Trash2Icon className="size-3.5" />}
            title={t('button.delete')}
            disabled={isLoading || expired}
            tooltipSide="top"
          />
        </Confirm>
      </div>

      {selectedShare && (
        <QRCodeModal
          open
          shareName={selectedShare.shareName}
          shareUrl={`${window.location.origin}/share/${selectedShare.token}`}
          onOpenChange={open => !open && setSelectedShare(null)}
        />
      )}

      {editingShare && (
        <ShareFormModal
          ref={editModalRef}
          key={editingShare.id}
          mode="configure"
          share={editingShare}
          onUpdate={async () => {
            await fetchShares()
            setEditingShare(null)
          }}
        />
      )}
    </>
  )
}
