import { Button } from '@shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shadcn/components/ui/dialog'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useImperativeHandle, useState } from 'react'

type ModalProps = {
  title: string
  description?: string
  width?: number
  cancelText?: string
  onCancel?: () => void
  confirmText?: string
  onConfirm?: () => void | Promise<void>
  trigger?: React.ReactNode
  children: React.ReactNode
} & Omit<React.ComponentProps<typeof Dialog>, 'open'>

export interface ModalRef {
  open: () => void
  close: () => void
  setLoading: (loading: boolean) => void
}

export function Modal({
  ref,
  title,
  description,
  width = 520,
  cancelText,
  onCancel,
  confirmText,
  onConfirm,
  trigger,
  children,
  onOpenChange,
  ...props
}: ModalProps & { ref?: React.RefObject<ModalRef | null> }) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    setLoading,
  }))

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  const handleConfirm = async () => {
    if (!onConfirm) {
      handleCancel()
      return
    }

    try {
      const result = onConfirm()
      if (result && typeof result.then === 'function') {
        setLoading(true)
        await result
        setOpen(false)
      }
      setOpen(false)
    }
    finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    onOpenChange?.(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent style={{ maxWidth: `${width}px` }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={handleCancel}
          >
            {cancelText || t('button.cancel')}
          </Button>
          <Button
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading && <Loader2Icon className="size-4 animate-spin" />}
            {confirmText || t('button.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
