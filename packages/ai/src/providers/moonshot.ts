import type { ModelClientOptions, ModelFetchOptions, ModelProvider } from '../types'
import { ofetch } from 'ofetch'

export const moonshot: ModelProvider = {
  id: 'moonshot',
  name: 'Moonshot',
  description: 'Moonshot AI (Kimi) models with long context support',
  baseURL: 'https://api.moonshot.cn/v1',
  help: {
    url: 'https://platform.moonshot.cn/console/api-keys',
    text: 'Moonshot Console',
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
