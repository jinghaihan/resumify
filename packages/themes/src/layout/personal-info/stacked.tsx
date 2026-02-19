import type { ResumePersonalInfo } from '@resumify/shared'
import type { PersonalInfoSpacing } from './types'
import { Icon } from '@iconify/react'

import { getNameFromUrl, normalizeUrl } from '@resumify/shared'
import { Markdown } from '../../markdown'
import { DEFAULT_PERSONAL_INFO_SPACING } from './types'

interface PersonalInfoItem {
  icon: string
  value: string
  url: string | null
}

interface HeaderRendererProps {
  name: string
  jobObjective?: string
  avatar?: string | null
  avatarShape?: string | null
  id?: string
  spacing?: PersonalInfoSpacing
}

function HeaderRenderer({
  name,
  jobObjective,
  avatar,
  avatarShape,
  id,
  spacing = DEFAULT_PERSONAL_INFO_SPACING,
}: HeaderRendererProps) {
  if (avatar) {
    return (
      <section className={`
        ${spacing.section}
        border-b border-border
        ${spacing.dividerPadding}
      `} id={id}
      >
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <img
              src={avatar}
              alt={name}
              className={avatarShape === 'circle'
                ? 'size-20 rounded-full'
                : `size-20 rounded-md`}
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              {name}
            </h1>
            {jobObjective && (
              <p className="mt-1 text-base text-muted-foreground">
                {jobObjective}
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={spacing.section} id={id}>
      <h1 className="mb-2 text-4xl font-semibold text-foreground">
        {name}
      </h1>
      {jobObjective && (
        <p className="text-muted-foreground">
          {jobObjective}
        </p>
      )}
    </section>
  )
}

export function PersonalInfoStacked(
  personalInfo: ResumePersonalInfo,
  spacing: PersonalInfoSpacing = DEFAULT_PERSONAL_INFO_SPACING,
): React.ReactNode {
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
    <>
      <HeaderRenderer
        name={personalInfo.name}
        jobObjective={personalInfo.jobObjective}
        avatar={personalInfo.photoUrl}
        avatarShape={personalInfo.photoShape}
        spacing={spacing}
      />
      {allItems.length > 0 && (
        <section className={`
          ${spacing.section}
          flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm
          text-muted-foreground
        `}
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
              {index < allItems.length - 1 && (
                <span className="text-muted-foreground/30">｜</span>
              )}
            </div>
          ))}
        </section>
      )}
    </>
  )
}
