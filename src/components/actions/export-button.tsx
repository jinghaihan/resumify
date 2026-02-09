'use client'
import { save } from '@resumify/shared'
import { useResumeStore } from '@resumify/store'
import { IconButton, Modal } from '@resumify/ui'
import { Button } from '@shadcn/components/ui/button'
import { Label } from '@shadcn/components/ui/label'
import { Textarea } from '@shadcn/components/ui/textarea'
import { FileBracesCornerIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

export function ExportButton() {
  const t = useTranslations()
  const store = useResumeStore()
  const [content, setContent] = useState('')

  const updateContent = () => {
    setContent(store.exportToJSON())
  }

  const handleUpdate = () => {
    const result = store.importFromJSON(content)
    if (!result)
      toast.error(t('message.import-failed'))
  }

  const handleConfirm = () => {
    const data = content || store.exportToJSON()
    save(data, 'application/json', `resume-${Date.now()}.json`)
    toast.success(t('message.export-success'))
  }

  return (
    <Modal
      title={t('export.title')}
      description={t('export.description')}
      confirmText={t('export.download')}
      trigger={(
        <IconButton
          icon={<FileBracesCornerIcon />}
          title={t('export.title')}
        />
      )}
      onOpenChange={updateContent}
      onConfirm={handleConfirm}
    >
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="space-y-2">
          <Label>{t('export.content')}</Label>
          <Textarea
            value={content}
            placeholder={t('export.placeholder')}
            onChange={e => setContent(e.target.value)}
            className="max-h-[400px] min-h-[200px] font-mono"
          />
        </div>

        <Button
          variant="outline"
          onClick={handleUpdate}
        >
          {t('export.update')}
        </Button>
      </div>
    </Modal>
  )
}
