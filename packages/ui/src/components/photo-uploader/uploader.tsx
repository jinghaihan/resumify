import type { PhotoShape } from '@resumify/shared'
import type { ModalRef } from '../modal'
import type { PhotoUploaderCropperRef } from './cropper'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { Modal } from '../modal'
import { PhotoUploaderCropper } from './cropper'
import { PhotoUploaderTrigger } from './trigger'

export interface PhotoUploaderProps {
  photo?: string
  shape?: PhotoShape
  onDelete?: () => void
  onConfirm?: (image: string, shape: PhotoShape) => void
}

export function PhotoUploader({ photo, shape, onDelete, onConfirm }: PhotoUploaderProps) {
  const t = useTranslations()
  const [file, setFile] = useState<File | null>(null)

  const modalRef = useRef<ModalRef>(null)
  const cropperRef = useRef<PhotoUploaderCropperRef>(null)

  const openModal = () => {
    modalRef.current?.open()
  }

  const handleConfirm = async () => {
    await cropperRef.current?.confirm()
  }

  return (
    <Modal
      ref={modalRef}
      title={t('photo-uploader.title')}
      description={t('photo-uploader.description')}
      width={416}
      onConfirm={handleConfirm}
      trigger={(
        <PhotoUploaderTrigger
          photo={photo}
          shape={shape}
          onDelete={onDelete}
          setFile={setFile}
          setOpen={openModal}
        />
      )}
    >
      {file && (
        <PhotoUploaderCropper
          ref={cropperRef}
          file={file}
          onConfirm={onConfirm}
        />
      )}
    </Modal>
  )
}
