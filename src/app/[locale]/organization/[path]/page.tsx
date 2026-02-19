import { OrganizationView } from '@resumify/auth'
import { organizationViewPaths } from '@resumify/auth/view-paths'
import { routing } from '@resumify/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.flatMap(locale => Object.values(organizationViewPaths).map(path => ({ locale, path })))
}

export default async function OrganizationPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params

  return (
    <main className="
      container p-4
      md:p-6
    "
    >
      <OrganizationView path={path} />
    </main>
  )
}
