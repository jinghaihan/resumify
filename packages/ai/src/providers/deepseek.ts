import type { ModelClientOptions, ModelFetchOptions, ModelProvider } from '../types'
import { ofetch } from 'ofetch'

export const deepseek: ModelProvider = {
  id: 'deepseek',
  name: 'DeepSeek',
  description: 'DeepSeek AI models with reasoning capabilities',
  baseURL: 'https://api.deepseek.com/v1',
  help: {
    url: 'https://platform.deepseek.com/api_keys',
    text: 'DeepSeek Platform',
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
