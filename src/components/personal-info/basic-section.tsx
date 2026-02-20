'use client'

import { cn } from '@resumify/shared'
import { usePersonalInfoStore } from '@resumify/store'
import { PhotoUploader } from '@resumify/ui'
import { Input } from '@shadcn/components/ui/input'
import { Label } from '@shadcn/components/ui/label'
import { useTranslations } from 'next-intl'

export function BasicSection({ className }: { className?: string }) {
  const t = useTranslations()
  const store = usePersonalInfoStore()

  return (
    <div className={cn('flex flex-1 flex-col gap-4 pb-4', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pr-2">
          <Label>{t('personal-info.name')}</Label>
          <Label>{t('personal-info.photo')}</Label>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder={t('personal-info.name')}
            value={store.name}
            onChange={e => store.updateName(e.target.value)}
          />
          <PhotoUploader
            photo={store.photoUrl}
            shape={store.photoShape}
            onDelete={() => store.updatePhotoUrl('')}
            onConfirm={(croppedImageUrl, shape) => {
              store.updatePhotoUrl(croppedImageUrl)
              store.updatePhotoShape(shape)
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t('personal-info.job-objective')}</Label>
        <Input
          placeholder={t('personal-info.job-objective')}
          value={store.jobObjective}
          onChange={e => store.updateJobObjective(e.target.value)}
        />
      </div>
    </div>
  )
}
