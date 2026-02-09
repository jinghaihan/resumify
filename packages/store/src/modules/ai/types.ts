import type { ModelProviderConfig } from '@resumify/shared'

export interface AIState {
  modelSelection: string
  providers: Record<string, ModelProviderConfig>
}

export interface AIActions {
  updateModelSelection: (modelSelection: string) => void

  updateProviders: (providers: Record<string, ModelProviderConfig>) => void

  updateProviderConfig: (provider: string, config: ModelProviderConfig) => void
  updateProviderApiKey: (provider: string, apiKey: string) => void
  updateProviderBaseURL: (provider: string, baseURL: string) => void
  updateProviderEnabled: (provider: string, enabled: boolean) => void
  toggleProviderEnabled: (provider: string) => void

  updateModels: (provider: string, models: ModelProviderConfig['models']) => void
  updateModelEnabled: (provider: string, model: string, enabled: boolean) => void
  toggleModelEnabled: (provider: string, model: string) => void
}

export type AIStore = {} & AIState & AIActions
