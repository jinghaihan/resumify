import { Button } from '@shadcn/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AddButtonProps {
  text?: string
  onAdd: () => void
}

export function AddButton({ text, onAdd }: AddButtonProps) {
  const t = useTranslations()
  return (
    <Button variant="outline" className="w-full" onClick={onAdd}>
      <PlusIcon className="size-4" />
      {text || t('button.add')}
    </Button>
  )
}
