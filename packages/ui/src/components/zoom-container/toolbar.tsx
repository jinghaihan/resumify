import { cn } from '@resumify/shared'
import { Button } from '@shadcn/components/ui/button'
import { MinusIcon, MousePointerIcon, PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { IconButton } from '../icon-button'
import { ZOOM_MAX, ZOOM_MIN } from './hooks'

interface ZoomContainerToolbarProps {
  className?: string
  percentage?: number
  isPanning?: boolean
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
}

export function ZoomContainerToolbar({
  className,
  percentage = 100,
  isPanning = false,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomContainerToolbarProps) {
  const t = useTranslations()

  return (
    <div
      className={cn(
        `
          flex items-center rounded-full border border-border bg-card px-2
          py-1.5 text-muted-foreground shadow-lg
        `,
        className,
      )}
    >
      <IconButton
        icon={<MousePointerIcon />}
        title={t('zoom.hold-space-drag')}
        className={isPanning ? 'bg-muted text-foreground' : ''}
      />

      <IconButton
        icon={<MinusIcon />}
        title={t('zoom.zoom-out')}
        onClick={onZoomOut}
        disabled={percentage <= ZOOM_MIN * 100}
      />

      <Button variant="ghost" size="default" onClick={onReset} title={t('zoom.reset-zoom')}>
        {`${percentage}%`}
      </Button>

      <IconButton
        icon={<PlusIcon />}
        title={t('zoom.zoom-in')}
        onClick={onZoomIn}
        disabled={percentage >= ZOOM_MAX * 100}
      />
    </div>
  )
}
