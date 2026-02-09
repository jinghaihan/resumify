import type { ResumePersonalInfo } from '@resumify/shared'
import { Icon } from '@iconify/react'
import { getNameFromUrl, normalizeUrl } from '@resumify/shared'

import { Markdown } from '../../markdown'

interface PersonalInfoItem {
  icon: string
  value: string
  url: string | null
}

export function PersonalInfoInline(personalInfo: ResumePersonalInfo): React.ReactNode {
  const personalInfoItems: PersonalInfoItem[] = personalInfo.personalInfo
    .filter(field => field.value)
    .map(field => ({
      icon: field.icon,
      value: field.value,
      url: null,
    }))

  const socialLinkItems: PersonalInfoItem[] = personalInfo.socialLinks
    .filter(link => link.value)
    .map(link => ({
      icon: link.icon,
      value: getNameFromUrl(link.value),
      url: link.value,
    }))

  const allItems = [...personalInfoItems, ...socialLinkItems]

  return (
    <section className="mb-8 flex items-start gap-6">
      <div className="flex shrink-0 items-center gap-4">
        {personalInfo.photoUrl && (
          <div className="shrink-0">
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.name}
              className={personalInfo.photoShape === 'circle'
                ? `size-16 rounded-full`
                : `size-16 rounded-md`}
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {personalInfo.name}
          </h1>
          {personalInfo.jobObjective && (
            <p className="mt-1 text-base text-muted-foreground">
              {personalInfo.jobObjective}
            </p>
          )}
        </div>
      </div>

      {/* Right: basic info */}
      {allItems.length > 0 && (
        <div className="
          ml-auto grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm
          text-muted-foreground
        "
        >
          {allItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <Icon icon={item.icon} className="size-3.5 shrink-0" />
              <div className="
                flex items-center
                [&_p]:my-0
              "
              >
                {item.url
                  ? (
                      <Markdown>{`[${item.value}](${normalizeUrl(item.url)})`}</Markdown>
                    )
                  : (
                      <span>{item.value}</span>
                    )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
