import type { PhotoShape } from '@resumify/shared'
import type { Crop } from 'react-image-crop'
import { DEFAULT_PHOTO_SHAPE, PHOTO_SHAPES_OPTIONS } from '@resumify/shared'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { centerCrop, makeAspectCrop, ReactCrop } from 'react-image-crop'
import { toast } from 'sonner'
import { Select } from '../select'
import 'react-image-crop/dist/ReactCrop.css'

interface PhotoUploaderCropperProps {
  file: File
  onConfirm?: (image: string, shape: PhotoShape) => void
}

export interface PhotoUploaderCropperRef {
  confirm: () => Promise<void>
}

export function PhotoUploaderCropper({
  ref,
  file,
  onConfirm,
}: PhotoUploaderCropperProps & { ref?: React.RefObject<PhotoUploaderCropperRef | null> }) {
  const t = useTranslations()
  const [shape, setShape] = useState<PhotoShape>(DEFAULT_PHOTO_SHAPE)
  const [crop, setCrop] = useState<Crop>()
  const [imageSrc, setImageSrc] = useState('')

  const imageRef = useRef<HTMLImageElement>(null)
  const aspect = PHOTO_SHAPES_OPTIONS.find(option => option.value === shape)?.aspectRatio || 1
  const options = PHOTO_SHAPES_OPTIONS.map(option => ({
    label: t(`photo-uploader.shape.${option.value}`),
    value: option.value,
  }))

  useEffect(() => {
    let canceled = false
    const reader = new FileReader()

    reader.onload = () => {
      if (canceled)
        return

      setImageSrc(typeof reader.result === 'string' ? reader.result : '')
    }

    reader.readAsDataURL(file)

    return () => {
      canceled = true
      reader.abort()
    }
  }, [file])

  const updateCrop = useCallback((e: React.SyntheticEvent<HTMLImageElement>, currentShape?: PhotoShape) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget

    const targetShape = currentShape || shape
    const targetAspect = PHOTO_SHAPES_OPTIONS.find(option => option.value === targetShape)?.aspectRatio || 1

    const centeredCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        targetAspect,
        width,
        height,
      ),
      width,
      height,
    )

    setCrop(centeredCrop)
  }, [shape])

  const updateShape = (value: PhotoShape) => {
    setShape(value)
    if (imageRef.current)
      updateCrop({ currentTarget: imageRef.current } as React.SyntheticEvent<HTMLImageElement>, value)
  }

  useImperativeHandle(ref, () => ({
    confirm: async () => {
      if (!imageRef.current || !crop)
        return

      try {
        const croppedImageUrl = await getCroppedImg(imageRef.current, crop)
        onConfirm?.(croppedImageUrl, shape)
      }
      catch {
        toast.error(t('message.crop-failed'))
      }
    },
  }), [crop, shape, onConfirm, t])

  return (
    <div className="flex flex-col gap-4">
      <Select
        options={options}
        value={shape}
        onValueChange={updateShape}
        defaultValue={DEFAULT_PHOTO_SHAPE}
      />

      <div className="overflow-hidden rounded-md">
        <ReactCrop
          crop={crop}
          aspect={aspect}
          onChange={c => setCrop(c)}
          keepSelection
        >
          {imageSrc && <img ref={imageRef} src={imageSrc} onLoad={updateCrop} />}
        </ReactCrop>
      </div>
    </div>
  )
}

async function getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx)
    throw new Error('No 2d context')

  const pixelRatio = window.devicePixelRatio || 1

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const cropX = (crop.x / 100) * image.width * scaleX
  const cropY = (crop.y / 100) * image.height * scaleY
  const cropWidth = (crop.width / 100) * image.width * scaleX
  const cropHeight = (crop.height / 100) * image.height * scaleY

  canvas.width = cropWidth * pixelRatio
  canvas.height = cropHeight * pixelRatio

  ctx.scale(pixelRatio, pixelRatio)

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  )

  return canvas.toDataURL('image/png')
}
