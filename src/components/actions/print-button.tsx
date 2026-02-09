'use client'

import { exportToPDF } from '@resumify/api'
import { useExportStore, useResumeStore } from '@resumify/store'
import { IconButton } from '@resumify/ui'
import { PrinterIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

export function PrintButton() {
  const t = useTranslations()
  const locale = useLocale()

  const resumeStore = useResumeStore()
  const { settings } = useExportStore()

  const [exporting, setExporting] = useState(false)

  const handlePrint = async () => {
    try {
      setExporting(true)
      toast.loading(t('message.pdf-exporting'), { id: 'pdf-export' })

      const resumeData = resumeStore.getResume()

      await exportToPDF({
        resume: resumeData,
        settings,
        locale,
      })

      toast.success(t('message.pdf-export-success'), { id: 'pdf-export' })
    }
    catch (error) {
      console.error('Export failed:', error)
      toast.error(t('message.pdf-export-failed'), { id: 'pdf-export' })
    }
    finally {
      setExporting(false)
    }
  }

  return (
    <IconButton
      icon={<PrinterIcon />}
      title={t('button.print')}
      disabled={exporting}
      loading={exporting}
      onClick={handlePrint}
    />
  )
}
