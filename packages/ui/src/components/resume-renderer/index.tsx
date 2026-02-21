import type {
  AtomicThemeConfig,
  PhotoShape,
  ProjectExperience,
  Resume,
  Section,
  SectionDistribution,
  Skill,
  ThemePreset,
  WorkExperience,
} from '@resumify/shared'
import {
  hasProjectExperiences,
  hasSkills,
  hasWorkExperiences,
} from '@resumify/store'
import {
  DEFAULT_SECTION_DISTRIBUTION,
  experienceHeaderRenderer,
  personalInfoRenderer,
  techStackRenderer,
  THEME_PRESETS,
  typographyRenderer,
  typographySpacingRenderer,
} from '@resumify/themes'
import { useTranslations } from 'next-intl'
import { ResumeLayout } from '../resume-layout'

export interface ResumeRendererProps {
  resume: Omit<Resume, 'id'>
  theme?: ThemePreset
  sectionDistribution?: SectionDistribution
  draggable?: boolean
  onLayoutChange?: (distribution: SectionDistribution) => void
  className?: string
  columnContentClassName?: string
}

export function ResumeRenderer({
  resume,
  theme,
  sectionDistribution,
  draggable = false,
  onLayoutChange,
  className,
  columnContentClassName,
}: ResumeRendererProps) {
  const t = useTranslations()

  const {
    themeConfig,
    renderers,
    customSections,
    distribution,
  } = getThemeAndDistribution(theme, resume, sectionDistribution)
  const {
    PersonalInfoRenderer,
    ExperienceHeaderRenderer,
    TechStackRenderer,
    MarkdownRenderer,
  } = renderers
  const spacing = typographySpacingRenderer(themeConfig)

  const sectionsRenderers = {
    personalInfoRenderer: PersonalInfoRenderer,
    skillsRenderer: (skills: Skill[]) => (
      <section className={spacing.section}>
        <MarkdownRenderer>{`## ${t('skills.title')}`}</MarkdownRenderer>
        <MarkdownRenderer>
          {skills.map(s => `- ${s.content}`).join('\n')}
        </MarkdownRenderer>
      </section>
    ),
    workExperiencesRenderer: (experiences: WorkExperience[]) => (
      <section className={spacing.section}>
        <MarkdownRenderer>{`## ${t('work-experience.title')}`}</MarkdownRenderer>
        {experiences.map((exp, index) => (
          <div key={exp.id}>
            <ExperienceHeaderRenderer
              name={exp.name}
              position={exp.role}
              startDate={exp.startDate}
              endDate={exp.endDate}
            />
            {(exp.description || exp.achievements) && (
              <div className={`
                ${spacing.content}
                text-sm text-muted-foreground
              `}
              >
                {exp.description && <MarkdownRenderer>{exp.description}</MarkdownRenderer>}
                {exp.achievements && (
                  <>
                    <MarkdownRenderer>{`**${t('field.achievements')}**`}</MarkdownRenderer>
                    <MarkdownRenderer>{exp.achievements}</MarkdownRenderer>
                  </>
                )}
              </div>
            )}
            {index < experiences.length - 1 && <MarkdownRenderer>---</MarkdownRenderer>}
          </div>
        ))}
      </section>
    ),
    projectExperiencesRenderer: (projects: ProjectExperience[]) => (
      <section className={spacing.section}>
        <MarkdownRenderer>{`## ${t('project-experience.title')}`}</MarkdownRenderer>
        {projects.map((proj, index) => (
          <div key={proj.id}>
            <ExperienceHeaderRenderer
              name={proj.name}
              position={proj.role}
              startDate={proj.startDate}
              endDate={proj.endDate}
            />
            {proj.techStack && proj.techStack.length > 0 && (
              <div className={spacing.content}>
                <TechStackRenderer techs={proj.techStack} />
              </div>
            )}
            {(proj.description || proj.achievements) && (
              <div className={`
                ${spacing.content}
                text-sm text-muted-foreground
              `}
              >
                {proj.description && <MarkdownRenderer>{proj.description}</MarkdownRenderer>}
                {proj.achievements && (
                  <>
                    <MarkdownRenderer>{`**${t('field.achievements')}**`}</MarkdownRenderer>
                    <MarkdownRenderer>{proj.achievements}</MarkdownRenderer>
                  </>
                )}
              </div>
            )}
            {index < projects.length - 1 && <MarkdownRenderer>---</MarkdownRenderer>}
          </div>
        ))}
      </section>
    ),
    customSectionRenderer: (section: Section) => (
      <section className={spacing.section}>
        <MarkdownRenderer>{section.content}</MarkdownRenderer>
      </section>
    ),
  }

  function renderSection(sectionId: string): React.ReactNode {
    switch (sectionId) {
      case 'personalInfo':
        return sectionsRenderers.personalInfoRenderer({
          name: resume.name,
          photoUrl: resume.photoUrl ?? '',
          photoShape: (resume.photoShape ?? 'square') as PhotoShape,
          jobObjective: resume.jobObjective,
          personalInfo: resume.personalInfo,
          socialLinks: resume.socialLinks,
        })
      case 'skills':
        return sectionsRenderers.skillsRenderer(resume.skills)
      case 'workExperience':
        return sectionsRenderers.workExperiencesRenderer(resume.workExperiences)
      case 'projectExperience':
        return sectionsRenderers.projectExperiencesRenderer(resume.projectExperiences)
      default: {
        const section = customSections.find(s => s.id === sectionId)
        return section ? sectionsRenderers.customSectionRenderer(section) : null
      }
    }
  }

  return (
    <div className={className}>
      <ResumeLayout
        columns={distribution}
        renderSection={renderSection}
        renderColumn={undefined}
        onChange={onLayoutChange}
        draggable={draggable}
        columnContentClassName={columnContentClassName}
      />
    </div>
  )
}

function getThemeAndDistribution(
  theme: ThemePreset | undefined,
  resume: Resume,
  sectionDistribution: SectionDistribution | undefined,
) {
  const currentTheme = theme
    ?? THEME_PRESETS.find(t => t.id === resume.presentation.theme)
    ?? THEME_PRESETS[0]

  const themeConfig = {
    ...currentTheme.config,
    ...resume.presentation.themeConfig,
  } as AtomicThemeConfig

  const PersonalInfoRenderer = personalInfoRenderer(themeConfig)
  const ExperienceHeaderRenderer = experienceHeaderRenderer(themeConfig)
  const TechStackRenderer = techStackRenderer(themeConfig)
  const MarkdownRenderer = typographyRenderer(themeConfig)

  const customSections = resume.sections ?? []
  const baseDistribution = sectionDistribution
    ?? (Object.keys(resume.presentation.sectionDistribution).length > 0
      ? resume.presentation.sectionDistribution
      : DEFAULT_SECTION_DISTRIBUTION)

  // Filter out empty sections - check for actual content, not just array length
  const hasSkillsContent = hasSkills(resume)
  const hasWorkExperiencesContent = hasWorkExperiences(resume)
  const hasProjectExperiencesContent = hasProjectExperiences(resume)

  const filteredDistribution = Object.fromEntries(
    Object.entries(baseDistribution).map(([column, sectionIds]) => [
      column,
      sectionIds.filter((id) => {
        if (id === 'skills')
          return hasSkillsContent
        if (id === 'workExperience')
          return hasWorkExperiencesContent
        if (id === 'projectExperience')
          return hasProjectExperiencesContent
        return true
      }),
    ]),
  )

  const allSectionIds = Object.values(filteredDistribution).flat()
  const missingCustomSections = customSections.filter(s => !allSectionIds.includes(s.id))

  const distribution = missingCustomSections.length > 0
    ? {
        ...filteredDistribution,
        main: [
          ...(filteredDistribution.main ?? []),
          ...missingCustomSections.map(s => s.id),
        ],
      }
    : filteredDistribution

  return {
    themeConfig,
    distribution,
    customSections,
    renderers: {
      PersonalInfoRenderer,
      ExperienceHeaderRenderer,
      TechStackRenderer,
      MarkdownRenderer,
    },
  }
}
