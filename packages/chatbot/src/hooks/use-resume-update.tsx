'use client'

import type { ResumeStore } from '@resumify/store'
import { resumeChatStatusSchema, resumeSchema } from '@resumify/shared'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { addResumeSnapshot } from '../storage'

interface UseResumeUpdateOptions {
  resumeStore: ResumeStore
  setIsUpdatingResume: (value: boolean) => void
  t: (key: string) => string
}

export function useResumeUpdate({
  resumeStore,
  setIsUpdatingResume,
  t,
}: UseResumeUpdateOptions) {
  const lastSnapshotAtRef = useRef<number | null>(null)

  const handleResumeStatusPart = useCallback((part: { data: unknown }) => {
    const statusResult = resumeChatStatusSchema.safeParse(part.data)
    if (!statusResult.success) {
      setIsUpdatingResume(false)
      toast.error(t('status.error'))
      return
    }

    if (statusResult.data.status === 'updating') {
      setIsUpdatingResume(true)
    }
    else {
      setIsUpdatingResume(false)
      toast.error(t('message.resume-update-failed'))
    }
  }, [setIsUpdatingResume, t])

  const handleResumeUpdatePart = useCallback((part: { data: unknown }) => {
    const result = resumeSchema.safeParse(part.data)
    if (!result.success) {
      setIsUpdatingResume(false)
      toast.error(t('status.error'))
      return
    }

    const before = resumeStore.getResume()
    const nextResume = result.data
    const nextPhotoUrl = typeof nextResume.photoUrl === 'string' && nextResume.photoUrl.trim().length > 0
      ? nextResume.photoUrl
      : before.photoUrl
    const after = {
      ...nextResume,
      photoUrl: nextPhotoUrl,
    }

    resumeStore.updateResume(after)
    const createdAt = Date.now()
    if (lastSnapshotAtRef.current !== createdAt) {
      lastSnapshotAtRef.current = createdAt
      void addResumeSnapshot({ before, after, createdAt })
    }
    setIsUpdatingResume(false)
    toast.success(t('message.resume-update-success'))
  }, [resumeStore, setIsUpdatingResume, t])

  return {
    handleResumeStatusPart,
    handleResumeUpdatePart,
  }
}
