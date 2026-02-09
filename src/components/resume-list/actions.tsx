import type { DatabaseResumeListItem } from '@resumify/database'
import type { Resume } from '@resumify/shared'
import type { ModalRef } from '@resumify/ui'
import {
  deleteResume,
  duplicateResume,
  getResumeDetail,
  renameResume,
} from '@resumify/api'
import { useResumeStore } from '@resumify/store'
import { Confirm, IconButton, Modal } from '@resumify/ui'
import { Input } from '@shadcn/components/ui/input'
import { CopyIcon, EditIcon, MousePointerClickIcon, Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

interface CardActionsProps {
  resume: DatabaseResumeListItem
  selectedResume: DatabaseResumeListItem | null
  setSelectedResume: (resume: DatabaseResumeListItem) => void
  fetchResumes: () => Promise<void>
}

export function CardActions({
  resume,
  selectedResume,
  setSelectedResume,
  fetchResumes,
}: CardActionsProps) {
  const t = useTranslations()
  const resumeStore = useResumeStore()

  const renameModalRef = useRef<ModalRef>(null)
  const duplicateModalRef = useRef<ModalRef>(null)

  const [inputValue, setInputValue] = useState('')
  const [loadingResumeId, setLoadingResumeId] = useState<string | null>(null)

  const openModal = (
    resume: DatabaseResumeListItem,
    ref: React.RefObject<ModalRef | null>,
    defaultValue: string,
  ) => {
    setSelectedResume(resume)
    setInputValue(defaultValue)
    ref.current?.open()
  }

  const handleConfirm = async (config: typeof modalConfigs[number]) => {
    const name = inputValue.trim()
    if (!selectedResume || !name) {
      toast.error(t('status.error'))
      throw new Error(t('status.error'))
    }

    try {
      config.ref.current?.setLoading(true)
      setLoadingResumeId(selectedResume.id)
      await config.operation({ id: selectedResume.id, name })
      await fetchResumes()
      toast.success(t(config.successKey))
      config.onSuccess(name)
      config.ref.current?.close()
    }
    catch {
      toast.error(t(config.errorKey))
      throw new Error(t(config.errorKey))
    }
    finally {
      config.ref.current?.setLoading(false)
      setLoadingResumeId(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, config: typeof modalConfigs[number]) => {
    if (e.key === 'Enter')
      handleConfirm(config)
  }

  const handleDelete = async (resume: DatabaseResumeListItem) => {
    try {
      await deleteResume(resume.id)
      await fetchResumes()
      toast.success(t('message.resume-delete-success'))

      if (resume.id === resumeStore.id) {
        useResumeStore.setState({ id: null })
        resumeStore.updateResumeName('')
      }
    }
    catch {
      toast.error(t('message.resume-delete-failed'))
    }
  }

  const handleLoadResume = async (resume: DatabaseResumeListItem) => {
    try {
      setLoadingResumeId(resume.id)
      const detail = await getResumeDetail(resume.id)

      resumeStore.updateResume(detail.data as Resume)
      useResumeStore.setState({
        id: detail.id,
        resumeName: detail.name,
      })

      toast.success(t('message.resume-load-success'))
    }
    catch {
      toast.error(t('message.resume-load-failed'))
    }
    finally {
      setLoadingResumeId(null)
    }
  }

  const modalConfigs = [
    {
      ref: renameModalRef,
      title: t('resume-list.rename-modal.title'),
      description: t('resume-list.rename-modal.description'),
      operation: renameResume,
      successKey: 'message.resume-rename-success',
      errorKey: 'message.resume-rename-failed',
      onSuccess: (name: string) => {
        if (selectedResume?.id === resumeStore.id) {
          resumeStore.updateResumeName(name)
        }
      },
    },
    {
      ref: duplicateModalRef,
      title: t('resume-list.duplicate-modal.title'),
      description: t('resume-list.duplicate-modal.description'),
      operation: duplicateResume,
      successKey: 'message.resume-duplicate-success',
      errorKey: 'message.resume-duplicate-failed',
      onSuccess: () => {},
    },
  ] as const

  const isLoading = loadingResumeId === resume.id
  const isOperating = selectedResume?.id === resume.id && isLoading

  return (
    <div className="flex items-center">
      <IconButton
        icon={<MousePointerClickIcon className="size-3.5" />}
        title={t('resume-list.load')}
        onClick={() => handleLoadResume(resume)}
        tooltipSide="top"
        loading={isLoading}
      />
      <IconButton
        icon={<EditIcon className="size-3.5" />}
        title={t('resume-list.rename')}
        onClick={() => openModal(resume, renameModalRef, resume.name)}
        tooltipSide="top"
        loading={isOperating}
        disabled={isLoading}
      />
      <IconButton
        icon={<CopyIcon className="size-3.5" />}
        title={t('resume-list.duplicate')}
        onClick={() => openModal(resume, duplicateModalRef, `${resume.name} (Copy)`)}
        tooltipSide="top"
        loading={isOperating}
        disabled={isLoading}
      />
      <Confirm
        title={t('resume-list.delete-confirm.title')}
        description={t('resume-list.delete-confirm.description')}
        onConfirm={() => handleDelete(resume)}
      >
        <IconButton
          icon={<Trash2Icon className="size-3.5" />}
          title={t('button.delete')}
          tooltipSide="top"
          disabled={isLoading}
        />
      </Confirm>

      {modalConfigs.map(config => (
        <Modal
          key={config.title}
          ref={config.ref}
          title={config.title}
          width={400}
          description={config.description}
          confirmText={t('button.save')}
          onConfirm={() => handleConfirm(config)}
        >
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={t('resume-list.resume-name')}
            onKeyDown={e => handleKeyDown(e, config)}
            autoFocus
          />
        </Modal>
      ))}
    </div>
  )
}
