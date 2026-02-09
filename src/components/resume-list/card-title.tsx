import { useResumeStore } from '@resumify/store'
import { Badge } from '@shadcn/components/ui/badge'
import { useTranslations } from 'next-intl'

interface CardTitleProps {
  id: string
  name: string
}

export function CardTitle({ id, name }: CardTitleProps) {
  const t = useTranslations()
  const store = useResumeStore()

  return (
    <div className="flex items-center gap-2">
      {name}
      {id === store.id && (
        <Badge variant="outline">
          {t('resume-list.current')}
        </Badge>
      )}
    </div>
  )
}
