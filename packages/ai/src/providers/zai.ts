import type { ModelClientOptions, ModelFetchOptions, ModelProvider } from '../types'
import { ofetch } from 'ofetch'

export const zai: ModelProvider = {
  id: 'zai',
  name: 'Z.AI Coding Plan',
  description: 'Z.AI (Zhipu) GLM models subscription plan - powered by GLM-4.7',
  baseURL: 'https://open.bigmodel.cn/api/paas/v4',
  help: {
    url: 'https://z.ai/manage-apikey/apikey-list',
    text: 'Z.AI API Keys',
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
    const { createZhipu: createZai } = await import('@ai-sdk/zai')
    return createZai({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
    })
  },
}
