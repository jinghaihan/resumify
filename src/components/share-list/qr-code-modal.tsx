'use client'

import type { ModalRef } from '@resumify/ui'
import { save } from '@resumify/shared'
import { Modal } from '@resumify/ui'
import { useTranslations } from 'next-intl'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useRef } from 'react'

interface QRCodeModalProps {
  shareName: string
  shareUrl: string
  open: boolean
  onOpenChange?: (open: boolean) => void
}

export function QRCodeModal({ shareName, shareUrl, open, onOpenChange }: QRCodeModalProps) {
  const t = useTranslations()
  const modalRef = useRef<ModalRef>(null)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const canvas = qrCodeRef.current?.querySelector('canvas')
    if (!canvas)
      return

    save(canvas.toDataURL('image/png'), 'image/png', `${shareName}-qrcode.png`)
    modalRef.current?.close()
  }

  useEffect(() => {
    if (open)
      modalRef.current?.open()
  }, [open])

  return (
    <Modal
      ref={modalRef}
      title={t('share-list.qr-code')}
      description=""
      width={400}
      confirmText={t('button.download')}
      onConfirm={handleDownload}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col items-center gap-4 py-4">
        {/* QR Code */}
        <div className="
          flex size-64 items-center justify-center rounded-lg border bg-white
          p-4
        "
        >
          <div ref={qrCodeRef}>
            <QRCodeCanvas
              value={shareUrl}
              size={240}
              marginSize={4}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        {/* Share URL */}
        <code
          className="
            rounded-md bg-muted p-2 font-mono text-sm break-all
            text-muted-foreground
          "
        >
          {shareUrl}
        </code>
      </div>
    </Modal>
  )
}
