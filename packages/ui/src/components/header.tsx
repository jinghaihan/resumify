interface HeaderProps {
  title: string
  subtitle: string
  action?: React.ReactNode
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </header>
  )
}
