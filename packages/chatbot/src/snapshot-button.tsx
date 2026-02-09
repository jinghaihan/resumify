'use client'

import type { ResumeSnapshot } from './storage'
import { formatDateTime } from '@resumify/shared'
import { useResumeStore } from '@resumify/store'
import { Confirm, IconButton, Popover, Result, Tooltip } from '@resumify/ui'
import {
  CircleHelpIcon,
  HistoryIcon,
  RefreshCcwIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  addResumeSnapshot,
  deleteResumeSnapshot,
  getResumeSnapshots,
} from './storage'

export function SnapshotButton() {
  const t = useTranslations()
  const store = useResumeStore()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snapshots, setSnapshots] = useState<ResumeSnapshot[]>([])

  const loadSnapshots = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getResumeSnapshots()
      setSnapshots(data)
    }
    catch {
      toast.error(t('message.resume-rollback-failed'))
    }
    finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    if (open)
      void loadSnapshots()
  }, [open, loadSnapshots])

  const handleRestore = useCallback((snapshot: ResumeSnapshot, target: 'before' | 'after') => {
    try {
      const targetResume = target === 'before' ? snapshot.before : snapshot.after
      const before = store.getResume()
      store.updateResume(targetResume)
      void addResumeSnapshot({
        before,
        after: targetResume,
        createdAt: Date.now(),
      })
      toast.success(t('message.resume-rollback-success'))
      setOpen(false)
    }
    catch {
      toast.error(t('message.resume-rollback-failed'))
    }
  }, [store, t])

  const handleDelete = useCallback(async (snapshot: ResumeSnapshot) => {
    if (!snapshot.id)
      return

    try {
      await deleteResumeSnapshot(snapshot.id)
      const data = await getResumeSnapshots()
      setSnapshots(data)
      toast.success(t('message.snapshot-delete-success'))
    }
    catch {
      toast.error(t('message.snapshot-delete-failed'))
    }
  }, [t])

  const content = useMemo(() => {
    if (loading) {
      return (
        <Result status="loading" className="py-3" />
      )
    }

    if (snapshots.length === 0) {
      return (
        <Result status="empty" className="py-3" />
      )
    }

    return (
      <div className="flex flex-col gap-0.5">
        {snapshots.map(snapshot => (
          <div
            key={snapshot.id ?? snapshot.createdAt}
            className="
              group flex items-center justify-between gap-2 rounded-md px-1.5
              py-1 text-xs transition
              hover:bg-muted
            "
          >
            <span className="font-medium tabular-nums">
              {formatDateTime(new Date(snapshot.createdAt))}
            </span>
            <div className="
              flex items-center gap-1 text-muted-foreground opacity-0 transition
              group-hover:opacity-100
            "
            >
              <Confirm
                title={t('confirm.snapshot-restore-before.title')}
                description={t('confirm.snapshot-restore-before.description')}
                onConfirm={() => handleRestore(snapshot, 'before')}
              >
                <IconButton
                  icon={<RefreshCcwIcon className="size-3.5" />}
                  size="icon-xs"
                />
              </Confirm>
              <Confirm
                title={t('confirm.snapshot-restore-after.title')}
                description={t('confirm.snapshot-restore-after.description')}
                onConfirm={() => handleRestore(snapshot, 'after')}
              >
                <IconButton
                  icon={<SparklesIcon className="size-3.5" />}
                  size="icon-xs"
                />
              </Confirm>
              <Confirm
                title={t('confirm.snapshot-delete.title')}
                description={t('confirm.snapshot-delete.description')}
                onConfirm={() => handleDelete(snapshot)}
              >
                <IconButton
                  icon={<XIcon className="size-3.5" />}
                  size="icon-xs"
                />
              </Confirm>
            </div>
          </div>
        ))}
      </div>
    )
  }, [loading, snapshots, handleRestore, handleDelete, t])

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      align="start"
      preventAutoFocus
      contentClassName="max-h-72 w-60 overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
      trigger={(
        <IconButton
          icon={<HistoryIcon />}
          title={t('snapshot.title')}
        />
      )}
      content={(
        <>
          <div className="
            flex items-center gap-1 px-2 pt-1 pb-0.5 text-[0.7rem] font-medium
            text-muted-foreground
          "
          >
            <span>{t('snapshot.title')}</span>
            <Tooltip content={t('snapshot.tip')} side="bottom">
              <button
                type="button"
                className="
                  inline-flex size-4 items-center justify-center rounded-sm
                  text-muted-foreground transition
                  hover:text-foreground
                "
              >
                <CircleHelpIcon className="size-3" />
              </button>
            </Tooltip>
          </div>
          {content}
        </>
      )}
    />
  )
}
