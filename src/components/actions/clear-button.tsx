'use client'
import { useResumeStore } from '@resumify/store'
import { Confirm, IconButton } from '@resumify/ui'
import { BrushCleaningIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ClearButton() {
  const t = useTranslations()
  const resumeStore = useResumeStore()

  const onConfirm = () => resumeStore.clearResume()

  return (
    <Confirm
      title={t('confirm.clear-resume.title')}
      description={t('confirm.clear-resume.description')}
      onConfirm={onConfirm}
    >
      <IconButton
        icon={<BrushCleaningIcon />}
        title={t('confirm.clear-resume.title')}
      />
    </Confirm>
  )
}
