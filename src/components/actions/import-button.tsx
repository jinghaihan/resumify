'use client'
import { useResumeStore } from '@resumify/store'
import { IconButton, Modal } from '@resumify/ui'
import { Button } from '@shadcn/components/ui/button'
import { Input } from '@shadcn/components/ui/input'
import { Label } from '@shadcn/components/ui/label'
import { Textarea } from '@shadcn/components/ui/textarea'
import { UploadIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export function ImportButton() {
  const t = useTranslations()
  const store = useResumeStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = event =>
        setContent(event.target?.result as string)
      reader.readAsText(selectedFile)
    }
  }

  const handleConfirm = () => {
    const result = store.importFromJSON(content)
    if (result)
      toast.success(t('message.import-success'))
    else
      toast.error(t('message.import-failed'))
  }

  return (
    <Modal
      title={t('import.title')}
      description={t('import.description')}
      confirmText={t('import.import')}
      trigger={(
        <IconButton
          icon={<UploadIcon />}
          title={t('import.title')}
        />
      )}
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
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          {t('import.upload')}
        </Button>

        <Input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept=".json"
          onChange={handleFileChange}
        />
      </div>
    </Modal>
  )
}
