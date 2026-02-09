import { cn } from '@resumify/shared/utils'

export function SquaresGrid({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div
      className={cn('size-full overflow-auto', className)}
      style={{
        backgroundImage: `
          linear-gradient(-90deg, color-mix(in oklab, var(--muted) 50%, transparent) 1px, transparent 1px),
          linear-gradient(color-mix(in oklab, var(--muted) 50%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundColor: 'color-mix(in oklab, var(--muted) 30%, transparent)',
      }}
    >
      {children}
    </div>
  )
}
