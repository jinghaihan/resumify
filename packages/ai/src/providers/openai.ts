import type { ModelClientOptions, ModelFetchOptions, ModelProvider } from '../types'
import { ofetch } from 'ofetch'

export const openai: ModelProvider = {
  id: 'openai',
  name: 'OpenAI',
  description: 'OpenAI models including GPT-5.2, o3, and GPT-4o',
  baseURL: 'https://api.openai.com/v1',
  help: {
    url: 'https://platform.openai.com/api-keys',
    text: 'OpenAI API Keys',
  },
  fetchModels: async (options: ModelFetchOptions) => {
    const response = await ofetch(`${options.baseURL}/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.apiKey}`,
      },
    })
    return response.data.map((i: Record<string, unknown>) => ({ id: i.id, name: i.id }))
  },
  createClient: async (options: ModelClientOptions) => {
    const { createOpenAI } = await import('@ai-sdk/openai')
    return createOpenAI({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
    })
  },
}
