import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@shadcn/components/ui/alert-dialog'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface ConfirmProps {
  title: string
  description: string
  children: React.ReactNode
  onCancel?: () => void
  onConfirm?: () => void | Promise<void>
}

export function Confirm({ title, description, onCancel, onConfirm, children }: ConfirmProps) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
      }
      setOpen(false)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            onClick={handleCancel}
          >
            {t('button.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading && <Loader2Icon className="size-4 animate-spin" />}
            {t('button.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
