'use client'

import type { ModelConfig, ModelProviderType } from '@resumify/ai'
import type { ModelProviderConfig, WithEnabled } from '@resumify/shared'
import { SUPPORTED_MODEL_PROVIDERS } from '@resumify/ai'
import { useAIStore } from '@resumify/store'
import { Alert, AlertDescription, AlertTitle } from '@shadcn/components/ui/alert'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { ProviderConfigCard } from './provider-config-card'

function getDefaultConfig(providerId: ModelProviderType): ModelProviderConfig {
  const providerInfo = SUPPORTED_MODEL_PROVIDERS.find(p => p.id === providerId)
  return {
    apiKey: '',
    baseURL: providerInfo?.baseURL || '',
    enabled: false,
    models: [],
  }
}

export function ModelProviderPanel() {
  const t = useTranslations()
  const { providers, updateProviderConfig, updateModelEnabled } = useAIStore()

  const [selectedProvider, setSelectedProvider] = useState<ModelProviderType>(() => {
    const enabledProviders = Object.entries(providers).filter(([_, config]) => config?.enabled)
    return (enabledProviders[0]?.[0] || 'openai') as ModelProviderType
  })

  const selectedConfig = useMemo(() => {
    const config = providers[selectedProvider]
    if (!config) {
      return getDefaultConfig(selectedProvider)
    }
    return {
      ...config,
      models: Array.isArray(config.models) ? config.models : [],
    }
  }, [providers, selectedProvider])

  function handleProviderChange(newProvider: ModelProviderType) {
    setSelectedProvider(newProvider)

    const existingConfig = providers[newProvider]
    if (!existingConfig) {
      const providerInfo = SUPPORTED_MODEL_PROVIDERS.find(p => p.id === newProvider)
      const baseUrl = providerInfo?.baseURL || ''
      updateProviderConfig(newProvider, {
        apiKey: '',
        baseURL: baseUrl,
        enabled: false,
        models: [],
      })
    }
  }

  function handleApiKeyChange(apiKey: string) {
    updateProviderConfig(selectedProvider, {
      ...selectedConfig,
      apiKey,
    })
  }

  function handleBaseUrlChange(baseURL: string) {
    updateProviderConfig(selectedProvider, {
      ...selectedConfig,
      baseURL,
    })
  }

  function handleEnabledChange(enabled: boolean) {
    updateProviderConfig(selectedProvider, {
      ...selectedConfig,
      enabled,
    })
  }

  function handleModelEnabledChange(modelId: string, enabled: boolean) {
    updateModelEnabled(selectedProvider, modelId, enabled)
  }

  function handleAvailableModelsChange(models: ModelConfig[]) {
    const currentModels = Array.isArray(selectedConfig.models) ? selectedConfig.models : []
    const modelsWithEnabled = models.map(model => ({
      ...model,
      enabled: currentModels.some(m => m.id === model.id && (m as WithEnabled<ModelConfig>).enabled),
    }))
    updateProviderConfig(selectedProvider, {
      ...selectedConfig,
      models: modelsWithEnabled,
    })
  }

  const selectedProviderInfo = SUPPORTED_MODEL_PROVIDERS.find(p => p.id === selectedProvider)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-lg font-semibold">{t('model-provider.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('model-provider.subtitle')}
        </p>
      </div>

      <Alert variant="default">
        <Info className="size-4" />
        <AlertTitle>{t('model-provider.privacy-notice.title')}</AlertTitle>
        <AlertDescription>
          {t('model-provider.privacy-notice.description')}
        </AlertDescription>
      </Alert>

      {selectedProviderInfo && (
        <ProviderConfigCard
          provider={selectedProvider}
          config={selectedConfig}
          onProviderChange={handleProviderChange}
          onApiKeyChange={handleApiKeyChange}
          onBaseUrlChange={handleBaseUrlChange}
          onEnabledChange={handleEnabledChange}
          onModelEnabledChange={handleModelEnabledChange}
          onAvailableModelsChange={handleAvailableModelsChange}
        />
      )}
    </div>
  )
}
