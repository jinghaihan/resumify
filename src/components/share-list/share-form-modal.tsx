'use client'

import type { DatabaseShareListItem } from '@resumify/database'
import type { ModalRef } from '@resumify/ui'
import { createShare, updateShare } from '@resumify/api'
import { authClient } from '@resumify/auth'
import { getExpirationDate, getExpirationPreset } from '@resumify/shared'
import { useResumeStore } from '@resumify/store'
import { Modal, Popover, Select } from '@resumify/ui'
import { Button } from '@shadcn/components/ui/button'
import { Calendar } from '@shadcn/components/ui/calendar'
import { Checkbox } from '@shadcn/components/ui/checkbox'
import { Input } from '@shadcn/components/ui/input'
import { Label } from '@shadcn/components/ui/label'
import { format } from 'date-fns'
import { CalendarDaysIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface ShareFormModalProps {
  ref?: React.RefObject<ModalRef | null>
  mode?: 'create' | 'configure'
  share?: DatabaseShareListItem
  onUpdate?: () => void
}

export function ShareFormModal({ mode = 'create', share, onUpdate, ref }: ShareFormModalProps) {
  const t = useTranslations()

  const { data: session } = authClient.useSession()

  const resumeStore = useResumeStore()

  const [shareName, setShareName] = useState(mode === 'configure' && share ? share.shareName : '')
  const [isOneTime, setIsOneTime] = useState(mode === 'configure' && share ? share.isOneTime : false)
  const [expiresAt, setExpiresAt] = useState<string>(() => {
    if (mode === 'configure' && share)
      return getExpirationPreset(share.expiresAt)
    return 'never'
  })
  const [customExpiresAt, setCustomExpiresAt] = useState<Date | undefined>(() => {
    if (mode === 'configure' && share?.expiresAt && getExpirationPreset(share.expiresAt) === 'custom')
      return new Date(share.expiresAt)
    return undefined
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [password, setPassword] = useState('')

  const modalRef = useRef<ModalRef>(null)

  useEffect(() => {
    if (ref) {
      (ref as React.RefObject<ModalRef | null>).current = modalRef.current
    }
  }, [ref])

  if (!session?.user)
    return null

  const handleSubmit = async () => {
    if (!session?.user)
      return

    if (mode === 'create' && !shareName.trim()) {
      toast.error(t('create-share.name-required-failed'))
      return
    }

    try {
      if (expiresAt === 'custom' && !customExpiresAt) {
        toast.error(t('create-share.date-required-failed'))
        return
      }

      const expirationDate = getExpirationDate(expiresAt, customExpiresAt?.toISOString())
      if (expiresAt === 'custom' && customExpiresAt && !expirationDate) {
        toast.error(t('create-share.invalid-date-failed'))
        return
      }

      if (mode === 'create') {
        const passwordValue = password.trim() || undefined
        await createShare({
          shareName: shareName.trim(),
          resumeData: resumeStore.getResume(),
          resumeName: resumeStore.resumeName || 'Untitled Resume',
          isOneTime,
          expiresAt: expirationDate?.toISOString() || null,
          password: passwordValue,
        })

        toast.success(t('message.share-create-success'))
      }
      else {
        if (!share)
          return

        await updateShare({
          id: share.id,
          shareName: shareName.trim(),
          expiresAt: expirationDate?.toISOString() || null,
          password: password.trim() || undefined,
        })

        toast.success(t('message.share-update-success'))
        onUpdate?.()
      }

      modalRef.current?.close()
    }
    catch {
      toast.error(mode === 'create' ? t('message.share-create-failed') : t('message.share-update-failed'))
    }
  }

  return (
    <Modal
      ref={modalRef}
      title={mode === 'create' ? t('create-share.title') : t('configure-share.title')}
      description={mode === 'create' ? t('create-share.description') : t('configure-share.description')}
      confirmText={t('button.save')}
      onConfirm={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        {/* Share Name */}
        <div className="flex flex-col gap-2">
          <Label>{t('create-share.share-name')}</Label>
          <Input
            value={shareName}
            onChange={e => setShareName(e.target.value)}
            placeholder={t('create-share.share-name-placeholder')}
          />
        </div>

        {/* One-time Share */}
        {mode === 'create'
          ? (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="one-time"
                  checked={isOneTime}
                  onCheckedChange={checked => setIsOneTime(checked as boolean)}
                />
                <Label htmlFor="one-time" className="cursor-pointer">
                  {t('create-share.one-time')}
                </Label>
              </div>
            )
          : share?.isOneTime
            ? (
                <div className="flex items-center gap-2">
                  <Checkbox checked disabled id="one-time" />
                  <Label htmlFor="one-time" className="text-muted-foreground">
                    {t('create-share.one-time')}
                  </Label>
                </div>
              )
            : null}

        {/* Expiration Time */}
        <div className="flex flex-col gap-2">
          <Label>{t('create-share.expires-at')}</Label>

          <div className="flex items-center gap-2">
            <Select
              value={expiresAt}
              onValueChange={value => setExpiresAt(value ?? 'never')}
              options={[
                { label: t('create-share.never'), value: 'never' },
                { label: t('create-share.1h'), value: '1h' },
                { label: t('create-share.24h'), value: '24h' },
                { label: t('create-share.7d'), value: '7d' },
                { label: t('create-share.30d'), value: '30d' },
                { label: t('create-share.custom'), value: 'custom' },
              ]}
            />

            {expiresAt === 'custom' && (
              <Popover
                open={calendarOpen}
                onOpenChange={setCalendarOpen}
                align="start"
                contentClassName="w-auto p-0"
                trigger={(
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarDaysIcon className="size-4" />
                    {customExpiresAt
                      ? format(customExpiresAt, 'PPP')
                      : t('create-share.select-date')}
                  </Button>
                )}
                content={(
                  <Calendar
                    mode="single"
                    selected={customExpiresAt}
                    onSelect={(date) => {
                      setCustomExpiresAt(date)
                      setCalendarOpen(false)
                    }}
                    disabled={date => date < new Date()}
                    autoFocus
                  />
                )}
              />
            )}
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <Label>{t('create-share.password')}</Label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('create-share.password-placeholder')}
          />
          <p className="text-xs text-muted-foreground">
            {t('create-share.password-hint')}
          </p>
        </div>
      </div>
    </Modal>
  )
}
