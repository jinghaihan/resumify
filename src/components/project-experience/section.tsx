'use client'

import type { ProjectExperience } from '@resumify/shared'
import type { WorkExperienceSectionProps } from '../work-experience/section'
import { TagInput } from '@resumify/ui'
import { Label } from '@shadcn/components/ui/label'
import { useTranslations } from 'next-intl'
import { WorkExperienceSection } from '../work-experience/section'

type ProjectExperienceSectionProps = {
  techStack: string[]
  onChange: (updates: Partial<ProjectExperience>) => void
} & Omit<WorkExperienceSectionProps, 'onChange'>

export function ProjectExperienceSection({
  techStack,
  onChange,
  ...props
}: ProjectExperienceSectionProps) {
  const t = useTranslations()

  return (
    <WorkExperienceSection
      {...props}
      nameLabel={t('project-experience.name')}
      roleLabel={t('project-experience.role')}
      onChange={onChange}
      footer={(
        <div className="flex flex-col gap-2">
          <Label>{t('project-experience.techStack')}</Label>
          <TagInput
            value={techStack}
            onChange={value => onChange({ techStack: value })}
          />
        </div>
      )}
    />
  )
}
