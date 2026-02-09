import type {
  ExperienceHeaderLayoutMode,
  LayoutMode,
  PersonalInfoLayoutMode,
  TechStackStyle,
  Typography,
} from '@resumify/shared'

export const DEFAULT_SECTION_DISTRIBUTION = {
  main: ['personalInfo', 'skills', 'workExperience', 'projectExperience'],
}

export const EXPERIENCE_HEADER_LAYOUT_MODES: ExperienceHeaderLayoutMode[] = [
  'opposite-ends',
]

export const LAYOUT_MODES: LayoutMode[] = [
  'single',
  'double',
  'reversed-double',
]

export const PERSONAL_INFO_LAYOUT_MODES: PersonalInfoLayoutMode[] = [
  'stacked',
  'inline',
]

export const TECH_STACK_BACKGROUNDS: TechStackStyle['background'][] = [
  'colored',
  'muted',
  'outline',
]

export const TECH_STACK_SHAPES: TechStackStyle['shape'][] = [
  'rounded',
  'square',
]

export const TYPOGRAPHIES: Typography[] = ['github']

export const THEME_LABELS = {
  layout: {
    'single': 'theme.single',
    'double': 'theme.double',
    'reversed-double': 'theme.reversed-double',
  },
  personalInfoLayout: {
    stacked: 'theme.stacked',
    inline: 'theme.inline',
  },
  experienceHeaderLayout: {
    'opposite-ends': 'theme.opposite-ends',
  },
  techStackBackground: {
    colored: 'theme.colored',
    muted: 'theme.muted',
    outline: 'theme.outline',
  },
  techStackShape: {
    rounded: 'theme.rounded',
    square: 'theme.square',
  },
  typography: {
    github: 'theme.github',
  },
} as const
