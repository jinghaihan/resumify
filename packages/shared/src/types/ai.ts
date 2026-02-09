import type { ModelConfig } from '@resumify/ai'

import type { WithEnabled } from './utils'

export interface ModelProviderConfig {
  enabled: boolean
  apiKey: string
  baseURL: string
  models: WithEnabled<ModelConfig>[]
}
