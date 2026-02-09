import { cn } from '@resumify/shared'
import { Label } from '@shadcn/components/ui/label'

interface FieldProps {
  label?: string
  description?: string
  inline?: boolean
  children: React.ReactNode
  className?: string
}

export function Field({
  label,
  description,
  inline = false,
  children,
  className,
}: FieldProps) {
  if (inline) {
    return (
      <div className={cn('flex items-center justify-between', className)}>
        <div className="space-y-0.5">
          {label && <Label>{label}</Label>}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
