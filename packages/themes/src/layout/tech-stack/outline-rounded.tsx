import { cn } from '@resumify/shared'
import { TECH_STACK_BADGE_BASE } from './constants'

interface TechStackProps {
  techs: string[]
}

export function TechStackOutlineRounded({ techs }: TechStackProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {techs.map(tech => (
        <span
          key={tech}
          className={cn(
            TECH_STACK_BADGE_BASE,
            'rounded-md border border-border text-foreground',
          )}
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
