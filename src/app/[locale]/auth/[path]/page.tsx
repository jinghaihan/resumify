import { AuthView } from '@resumify/auth'
import { authViewPaths } from '@resumify/auth/view-paths'
import { routing } from '@resumify/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.flatMap(locale => Object.values(authViewPaths).map(path => ({ locale, path })))
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params

  return (
    <main className="
      container flex grow flex-col items-center justify-center self-center p-4
      md:p-6
    "
    >
      <AuthView path={path} />
    </main>
  )
}
