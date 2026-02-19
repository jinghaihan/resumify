'use client'

import type { ModelConfig, ModelProviderType } from '@resumify/ai'
import type { ModelProviderConfig, WithEnabled } from '@resumify/shared'
import { SUPPORTED_MODEL_PROVIDERS } from '@resumify/ai'
import { Button } from '@shadcn/components/ui/button'
import { Input } from '@shadcn/components/ui/input'
import { Label } from '@shadcn/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/components/ui/select'
import { Switch } from '@shadcn/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

interface ProviderConfigCardProps {
  provider: ModelProviderType
  config: ModelProviderConfig
  onProviderChange: (provider: ModelProviderType) => void
  onApiKeyChange: (apiKey: string) => void
  onBaseUrlChange: (baseUrl: string) => void
  onEnabledChange: (enabled: boolean) => void
  onModelEnabledChange: (modelId: string, enabled: boolean) => void
  onAvailableModelsChange: (models: ModelConfig[]) => void
}

export function ProviderConfigCard({
  provider,
  config,
  onProviderChange,
  onApiKeyChange,
  onBaseUrlChange,
  onEnabledChange,
  onModelEnabledChange,
  onAvailableModelsChange,
}: ProviderConfigCardProps) {
  const t = useTranslations()
  const providerInfo = SUPPORTED_MODEL_PROVIDERS.find(p => p.id === provider)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayModels = useMemo(() => {
    return Array.isArray(config.models) ? config.models : []
  }, [config.models])

  const handleFetchModels = async () => {
    if (!config?.apiKey) {
      setError(t('model-provider.api-key-required'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const baseURL = config?.baseURL || providerInfo?.baseURL || ''
      const response = await providerInfo?.fetchModels({
        apiKey: config.apiKey,
        baseURL,
      })

      if (response) {
        const currentModels = Array.isArray(config.models) ? config.models : []
        const modelList = response.map((model: ModelConfig) => ({
          ...model,
          enabled: currentModels.some(m => m.id === model.id && (m as WithEnabled<ModelConfig>).enabled),
        }))
        onAvailableModelsChange(modelList)
      }
    }
    catch (err) {
      setError(err instanceof Error ? err.message : t('model-provider.fetch-failed'))
    }
    finally {
      setLoading(false)
    }
  }

  const handleModelToggle = (modelId: string, enabled: boolean) => {
    onModelEnabledChange(modelId, enabled)
  }

  const displayBaseUrl = config?.baseURL || providerInfo?.baseURL || ''

  if (!providerInfo) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Select
              value={provider}
              onValueChange={value => onProviderChange(value as ModelProviderType)}
            >
              <SelectTrigger className="
                h-auto border-none bg-transparent! p-0 text-base font-semibold
                shadow-none
                focus-visible:ring-0
              "
              >
                <SelectValue>
                  {providerInfo.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_MODEL_PROVIDERS.map((provider) => {
                  return (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {providerInfo.description}
          </p>
        </div>
        <Switch
          checked={config?.enabled || false}
          onCheckedChange={onEnabledChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${provider}-apiKey`}>{t('model-provider.api-key')}</Label>
        <Input
          id={`${provider}-apiKey`}
          type="password"
          placeholder={t('model-provider.api-key-placeholder')}
          value={config?.apiKey || ''}
          onChange={e => onApiKeyChange(e.target.value)}
          className="font-mono text-xs"
        />
        <div className="text-xs text-muted-foreground">
          {`${t('model-provider.get-api-key-from')} `}
          <a
            href={providerInfo.help.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-primary
              hover:underline
            "
          >
            {providerInfo.help.text}
          </a>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${provider}-baseUrl`}>{t('model-provider.base-url')}</Label>
        <Input
          id={`${provider}-baseUrl`}
          type="url"
          placeholder={t('model-provider.base-url-placeholder')}
          value={displayBaseUrl}
          onChange={e => onBaseUrlChange(e.target.value)}
          className="font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          size="default"
          onClick={handleFetchModels}
          disabled={loading || !config?.apiKey}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {loading ? t('model-provider.fetching-models') : t('model-provider.fetch-models')}
        </Button>

        {error && (
          <div className="
            rounded-md bg-destructive/10 p-2 text-xs text-destructive
          "
          >
            {error}
          </div>
        )}

        {displayModels.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label className="text-sm">{t('model-provider.available-models')}</Label>
            <div className="space-y-1.5">
              {displayModels.map(model => (
                <div
                  key={model.id}
                  className="
                    flex items-center justify-between gap-2 rounded-md border
                    p-2
                  "
                >
                  <span className="text-sm">{model.name}</span>
                  <Switch
                    size="sm"
                    checked={model.enabled || false}
                    onCheckedChange={enabled => handleModelToggle(model.id, enabled)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
