import type { ModelClientOptions, ModelFetchOptions, ModelProvider } from '../types'
import { ofetch } from 'ofetch'

export const anthropic: ModelProvider = {
  id: 'anthropic',
  name: 'Anthropic',
  description: 'Claude models from Anthropic',
  baseURL: 'https://api.anthropic.com/v1',
  help: {
    url: 'https://platform.claude.com/settings/keys',
    text: 'Anthropic Console',
  },
  fetchModels: async (options: ModelFetchOptions) => {
    const response = await ofetch(`${options.baseURL}/models`, {
      headers: {
        'x-api-key': options.apiKey,
        'anthropic-version': '2023-06-01',
      },
    })
    return response.data.map((i: Record<string, unknown>) => ({ id: i.id, name: i.id }))
  },
  createClient: async (options: ModelClientOptions) => {
    const { createAnthropic } = await import('@ai-sdk/anthropic')
    return createAnthropic({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
    })
  },
}
