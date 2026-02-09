import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@shadcn/components/ui/empty'
import { Loader2Icon, SearchIcon, SearchXIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export type ResultStatus = 'empty' | 'loading' | 'error'

interface ResultProps {
  className?: string
  icon?: React.ReactNode
  status?: ResultStatus
  title?: string
  description?: string
  children?: React.ReactNode
}

export function Result({
  className,
  icon: iconProp,
  status,
  title: titleProp,
  description,
  children,
}: ResultProps) {
  const t = useTranslations()

  const icon = useMemo(() => {
    if (iconProp)
      return iconProp
    if (status === 'empty')
      return <SearchIcon />
    if (status === 'loading')
      return <Loader2Icon />
    if (status === 'error')
      return <SearchXIcon />
  }, [status, iconProp])

  const title = useMemo(() => {
    if (titleProp)
      return titleProp
    if (status === 'empty')
      return t('status.empty')
    if (status === 'loading')
      return t('status.loading')
    if (status === 'error')
      return t('status.error')
  }, [status, titleProp, t])

  return (
    <Empty className={className}>
      <EmptyMedia variant="icon">
        {icon}
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent>
        {children}
      </EmptyContent>
    </Empty>
  )
}
