import { parseMarkdownLink } from '@resumify/shared'

interface ExperienceHeaderOppositeEndsProps {
  name: string
  position?: string
  startDate?: string
  endDate?: string
  id?: string
}

export function ExperienceHeaderOppositeEnds({
  name,
  position,
  startDate,
  endDate,
  id,
}: ExperienceHeaderOppositeEndsProps) {
  const parsedNameLink = parseMarkdownLink(name)

  return (
    <div id={id} className="flex flex-wrap items-start justify-between gap-2">
      <div className="flex-1">
        {name && (
          <h3 className="text-lg font-semibold text-foreground">
            {parsedNameLink
              ? (
                  <a
                    href={parsedNameLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      underline underline-offset-2
                      hover:text-primary
                    "
                  >
                    {parsedNameLink.text}
                  </a>
                )
              : name}
          </h3>
        )}
        {position && (
          <p className="text-sm text-muted-foreground">
            {position}
          </p>
        )}
      </div>
      {(startDate || endDate) && (
        <div className="text-sm text-muted-foreground">
          {`${startDate ?? ''} - ${endDate ?? ''}`}
        </div>
      )}
    </div>
  )
}
