import type { ModelClientOptions, ModelFetchOptions, ModelProvider } from '../types'
import { ofetch } from 'ofetch'

export const google: ModelProvider = {
  id: 'google',
  name: 'Google Gemini',
  description: 'Google Gemini AI models',
  baseURL: 'https://aistudio.google.com/api-keys',
  help: {
    url: 'https://generativelanguage.googleapis.com/v1beta',
    text: 'Google API Keys',
  },
  fetchModels: async (options: ModelFetchOptions) => {
    const response = await ofetch(`${options.baseURL}/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.baseURL}`,
      },
    })
    return response.data.map((i: Record<string, unknown>) => ({ id: i.name, name: i.displayName }))
  },
  createClient: async (options: ModelClientOptions) => {
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google')
    return createGoogleGenerativeAI({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
    })
  },
}
