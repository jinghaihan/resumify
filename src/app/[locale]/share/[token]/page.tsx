import { shareService } from '@resumify/database'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { PasswordPrompt } from '@/components/resume/password-prompt'
import { ResumeViewer } from '@/components/resume/viewer'

interface SharePageProps {
  params: Promise<{ locale: string, token: string }>
}

export async function generateMetadata() {
  return {
    other: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }
}

async function renderAccessDenied(title: string, message: string) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params
  const t = await getTranslations()

  const share = await shareService.detailByToken(token)
  if (!share) {
    return renderAccessDenied(t('share-access.share-not-found'), t('share-access.share-not-found-description'))
  }

  // Check if share is accessible (not expired, not inactive)
  const isAccessible = await shareService.isAccessible(share.id)
  if (!isAccessible) {
    const message = !share.isActive
      ? t('share-access.share-stopped-by-owner')
      : t('share-access.share-expired')
    return renderAccessDenied(t('share-access.share-no-longer-accessible'), message)
  }

  // Handle password-protected shares
  if (share.password) {
    const cookieStore = await cookies()
    const verifyCookie = cookieStore.get(`share_verify_${token}`)
    if (!verifyCookie) {
      return <PasswordPrompt shareToken={token} />
    }
  }

  // Increment view count
  try {
    await shareService.incrementViewCount(share.id)
  }
  catch {
    // One-time share already consumed
    return renderAccessDenied(
      t('share-access.share-no-longer-accessible'),
      t('share-access.one-time-share-consumed'),
    )
  }

  // Parse resume data
  const resumeData = typeof share.resumeData === 'string'
    ? JSON.parse(share.resumeData)
    : share.resumeData

  return <ResumeViewer resumeData={resumeData} />
}
