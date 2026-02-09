'use client'

import { verifyShare } from '@resumify/api'
import { Button } from '@shadcn/components/ui/button'
import { Input } from '@shadcn/components/ui/input'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface PasswordPromptProps {
  shareToken: string
}

export function PasswordPrompt({ shareToken }: PasswordPromptProps) {
  const t = useTranslations()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!password.trim())
      return

    const passwordValue = password
    setLoading(true)
    setError(null)

    try {
      const isValid = await verifyShare({
        token: shareToken,
        password: passwordValue,
      })

      if (!isValid) {
        setError(t('share-access.invalid-password'))
        setLoading(false)
        return
      }

      window.location.reload()
    }
    catch {
      setError(t('share-access.verify-error'))
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')
      handleSubmit()
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-semibold">{t('share-access.password-required')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('share-access.password-required-description')}
        </p>

        <div className="space-y-2">
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('share-access.enter-password')}
            autoFocus
            disabled={loading}
            className={error ? 'border-destructive' : ''}
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <Button
          className="w-full"
          variant="outline"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading && <Loader2Icon className="animate-spin" />}
          {t('button.submit')}
        </Button>
      </div>
    </div>
  )
}
