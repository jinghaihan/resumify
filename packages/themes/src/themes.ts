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
  },
} as const
