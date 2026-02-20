import type { ReactNode } from 'react'
import { Button } from '@shadcn/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { Tooltip } from './tooltip'

type IconButtonProps = {
  icon: ReactNode
  title?: string
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right'
  loading?: boolean
} & React.ComponentProps<typeof Button>

export function IconButton({
  icon,
  title,
  tooltipSide = 'bottom',
  loading = false,
  variant = 'ghost',
  size = 'icon',
  className,
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2Icon className="animate-spin" /> : icon}
      <span className="sr-only">{title}</span>
    </Button>
  )

  if (!title)
    return button

  return (
    <Tooltip content={title} side={tooltipSide}>
      {button}
    </Tooltip>
  )
}
