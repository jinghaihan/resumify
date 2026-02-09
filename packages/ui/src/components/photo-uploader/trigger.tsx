import type { PhotoUploaderProps } from './uploader'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@shadcn/components/ui/avatar'
import { ImageUpIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type PhotoUploaderTriggerProps = {
  setFile: (file: File) => void
  setOpen: (open: boolean) => void
} & PhotoUploaderProps

const FILE_ACCEPTS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 1024 * 1024 * 5

export function PhotoUploaderTrigger({
  photo,
  shape,
  onDelete,
  setFile,
  setOpen,
}: PhotoUploaderTriggerProps) {
  const t = useTranslations()

  const isCircleShape = shape === 'circle'

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file)
      return

    if (!FILE_ACCEPTS.includes(file.type)) {
      toast.error(t('message.upload-format-failed'))
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(t('message.upload-size-failed'))
      return
    }

    setOpen(true)
    setFile(file)

    e.target.value = ''
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.()
  }

  return (
    <>
      <label htmlFor="photo-uploader" className="cursor-pointer">
        <Avatar size="lg">
          <AvatarImage
            key={photo}
            src={photo}
            alt="photo"
            className={isCircleShape ? 'rounded-full' : ''}
          />
          <AvatarFallback className="bg-muted">
            <ImageUpIcon className="text-muted-foreground" />
          </AvatarFallback>
          {photo && (
            <AvatarBadge
              className="bg-muted text-muted-foreground"
              onClick={handleDelete}
            >
              <XIcon />
            </AvatarBadge>
          )}
        </Avatar>

      </label>
      <input
        id="photo-uploader"
        type="file"
        className="hidden"
        accept={FILE_ACCEPTS.join(',')}
        onChange={handleSelectFile}
      />
    </>
  )
}
