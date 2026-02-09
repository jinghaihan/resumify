'use client'
import type { ModalRef } from '@resumify/ui'
import { authClient } from '@resumify/auth'
import { useResumeStore } from '@resumify/store'
import { IconButton, Modal } from '@resumify/ui'
import { Input } from '@shadcn/components/ui/input'
import { SaveIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export function SaveButton() {
  const t = useTranslations()
  const { data: session } = authClient.useSession()

  const resumeStore = useResumeStore()
  const [resumeName, setResumeName] = useState('')

  const saveModalRef = useRef<ModalRef>(null)

  if (!session?.user)
    return null

  const handleSave = async () => {
    const result = await resumeStore.save()

    if (result.success)
      toast.success(t('message.save-success'))
    else if (result.notFound)
      resumeStore.updateResumeName('')
    else if (result.error)
      toast.error(result.error)
  }

  const handleConfirm = async () => {
    if (!resumeName.trim()) {
      toast.error(t('status.error'))
      throw new Error(t('status.error'))
    }

    try {
      saveModalRef.current?.setLoading(true)
      resumeStore.updateResumeName(resumeName.trim())
      await handleSave()
      setResumeName('')
    }
    finally {
      saveModalRef.current?.setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter')
      handleConfirm()
  }

  if (resumeStore.id) {
    return (
      <IconButton
        icon={<SaveIcon />}
        title={t('button.save')}
        disabled={resumeStore.saving}
        loading={resumeStore.saving}
        onClick={handleSave}
      />
    )
  }

  return (
    <Modal
      ref={saveModalRef}
      title={t('resume-list.create-modal.title')}
      width={400}
      description={t('resume-list.create-modal.description')}
      confirmText={t('button.save')}
      onConfirm={handleConfirm}
      trigger={(
        <IconButton
          icon={<SaveIcon />}
          title={t('button.save')}
          disabled={resumeStore.saving}
        />
      )}
    >
      <Input
        value={resumeName}
        onChange={e => setResumeName(e.target.value)}
        placeholder={t('resume-list.resume-name')}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </Modal>
  )
}
