'use client'

import { useIsMounted } from '@resumify/shared'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { IconButton } from './icon-button'

export function DarkToggle() {
  const t = useTranslations()
  const { theme, setTheme } = useTheme()

  const isMounted = useIsMounted()
  if (!isMounted())
    return null

  return (
    <IconButton
      icon={theme === 'dark' ? <MoonIcon /> : <SunIcon />}
      title={t('button.dark-toggle')}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    />
  )
}
