import { useAIStore } from './store'

export function modelSelection() {
  return useAIStore.getState().modelSelection
}

export function modelProviders() {
  return useAIStore.getState().providers
}

export function modelSelections() {
  return Object.entries(useAIStore.getState().providers)
    .filter(([_, provider]) => provider.enabled)
    .map(([provider]) => provider)
}

export function modelSelectionsGroupedByProvider() {
  const data = Object.entries(useAIStore.getState().providers)
  return data
    .filter(([_, config]) => config.enabled && config.models.some(model => model.enabled))
    .map((item) => {
      const [provider, config] = item
      return {
        label: provider,
        value: provider,
        children: config.models.map(model => ({
          label: model.name,
          value: model.id,
        })),
      }
    })
}
