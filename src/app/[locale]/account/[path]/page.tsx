import { AccountView } from '@resumify/auth'
import { accountViewPaths } from '@resumify/auth/view-paths'
import { routing } from '@resumify/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.flatMap(locale => Object.values(accountViewPaths).map(path => ({ locale, path })))
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params

  return (
    <main className="
      container p-4
      md:p-6
    "
    >
      <AccountView path={path} />
    </main>
  )
}
