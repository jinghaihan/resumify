import type { ComponentProps } from 'react'
import { createElement } from 'react'
import { ExperienceHeaderOppositeEnds } from './layout/experience-header'
import { PersonalInfoInline, PersonalInfoStacked } from './layout/personal-info'
import {
  TechStackColoredRounded,
  TechStackColoredSquare,
  TechStackMutedRounded,
  TechStackMutedSquare,
  TechStackOutlineRounded,
  TechStackOutlineSquare,
} from './layout/tech-stack'
import { Markdown } from './markdown'

type MarkdownProps = ComponentProps<typeof Markdown>

export const ATOMIC_THEME_CONFIG = {
  personalInfo: {
    stacked: PersonalInfoStacked,
    inline: PersonalInfoInline,
  },

  experienceHeader: {
    'opposite-ends': ExperienceHeaderOppositeEnds,
  },

  techStack: {
    'colored-rounded': TechStackColoredRounded,
    'colored-square': TechStackColoredSquare,
    'muted-rounded': TechStackMutedRounded,
    'muted-square': TechStackMutedSquare,
    'outline-rounded': TechStackOutlineRounded,
    'outline-square': TechStackOutlineSquare,
  },

  typography: {
    github: Markdown,
    compact: (props: MarkdownProps) => createElement(Markdown, { ...props, style: 'compact' }),
  },
} as const

export const ATOMIC_THEME_SPACING = {
  typography: {
    github: {
      section: 'mb-8',
      content: 'mt-2',
      personalInfoSection: 'mb-8',
      personalInfoDividerPadding: 'pb-8',
    },
    compact: {
      section: 'mb-5',
      content: 'mt-1.5',
      personalInfoSection: 'mb-5',
      personalInfoDividerPadding: 'pb-5',
    },
  },
} as const
