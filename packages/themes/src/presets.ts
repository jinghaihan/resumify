import type { ThemePreset } from '@resumify/shared'

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Minimal style with clean borders',
    config: {
      layout: 'single',
      personalInfoLayout: 'stacked',
      experienceHeaderLayout: 'opposite-ends',
      techStackStyle: {
        background: 'colored',
        shape: 'rounded',
      },
      typography: 'github',
    },
  },
]
