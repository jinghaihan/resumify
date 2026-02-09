import { SUPPORTED_MODEL_PROVIDERS } from '@resumify/ai'
import { useAIStore } from '@resumify/store'
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from '@shadcn/components/ai-elements/model-selector'
import { Button } from '@shadcn/components/ui/button'
import { CheckIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

// Create a map of provider info for quick lookup
const providerInfoMap = new Map(
  SUPPORTED_MODEL_PROVIDERS.map(p => [p.id, { name: p.name }]),
)

interface ChatModel {
  id: string
  name: string
  provider: string
}

interface ProviderModels {
  name: string
  models: ChatModel[]
}

interface ModelSelectorCompactProps {
  selectedModelId: string | undefined
  onModelChange?: (modelId: string) => void
}

function parseModelId(modelId: string | undefined): { provider: string | undefined, id: string | undefined } {
  if (!modelId)
    return { provider: undefined, id: undefined }

  const [provider, id] = modelId.split('/')
  return { provider, id }
}

function findSelectedModel(allModels: ChatModel[], modelId: string | undefined): ChatModel | undefined {
  const { provider, id } = parseModelId(modelId)

  if (!provider || !id)
    return undefined

  return allModels.find(m => m.provider === provider && m.id === id)
}

export function ModelSelectorCompact({ selectedModelId, onModelChange }: ModelSelectorCompactProps) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const { providers } = useAIStore()

  const modelsByProvider = useMemo(() => {
    return Object.entries(providers).reduce<Record<string, ProviderModels>>((acc, [provider, config]) => {
      if (!config.enabled || !Array.isArray(config.models))
        return acc

      const enabledModels = config.models.filter(m => m.enabled)
      if (!enabledModels.length)
        return acc

      const providerInfo = providerInfoMap.get(provider)
      if (!providerInfo)
        return acc

      acc[provider] = {
        name: providerInfo.name,
        models: enabledModels.map((m: { id: string, name: string }) => ({
          id: m.id,
          name: m.name,
          provider,
        })),
      }

      return acc
    }, {})
  }, [providers])

  const allModels = Object.values(modelsByProvider).flatMap(p => p.models)
  const selectedModel = findSelectedModel(allModels, selectedModelId)

  useEffect(() => {
    if (!selectedModelId && allModels.length > 0 && onModelChange) {
      const firstModel = allModels[0]
      onModelChange(`${firstModel.provider}/${firstModel.id}`)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ModelSelector onOpenChange={setOpen} open={open}>
      <ModelSelectorTrigger asChild>
        <Button className="h-8 justify-between px-2" variant="ghost">
          {selectedModel?.provider && <ModelSelectorLogo provider={selectedModel.provider} />}
          <ModelSelectorName>{selectedModel?.name || t('chat.select-model')}</ModelSelectorName>
        </Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder={t('chat.search-models')} />
        <ModelSelectorList>
          {Object.entries(modelsByProvider).map(
            ([providerKey, { name: providerName, models: providerModels }]) => (
              <ModelSelectorGroup
                heading={providerName}
                key={providerKey}
              >
                {providerModels.map((model) => {
                  const fullModelId = `${model.provider}/${model.id}`
                  const isSelected = fullModelId === selectedModelId

                  return (
                    <ModelSelectorItem
                      key={fullModelId}
                      onSelect={() => {
                        onModelChange?.(fullModelId)
                        setOpen(false)
                      }}
                      value={fullModelId}
                    >
                      <ModelSelectorLogo provider={providerKey} />
                      <ModelSelectorName>{model.name}</ModelSelectorName>
                      {isSelected && <CheckIcon className="ml-auto size-4" />}
                    </ModelSelectorItem>
                  )
                })}
              </ModelSelectorGroup>
            ),
          )}
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  )
}
