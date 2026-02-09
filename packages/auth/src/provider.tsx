'use client'

import type { ReactNode } from 'react'
import { AuthUIProvider } from '@better-auth/ui'
import { useRouter } from '@resumify/i18n'
import Link from 'next/link'
import { authClient } from './client'
import { zh } from './locales/zh'

export function AuthProvider({ children, locale }: { children: ReactNode, locale: string }) {
  const router = useRouter()
  const localization = locale === 'zh' ? zh : undefined

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={router.refresh}
      Link={Link}
      localization={localization}
      social={{ providers: ['github'] }}
    >
      {children}
    </AuthUIProvider>
  )
}
