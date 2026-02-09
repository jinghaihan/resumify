import type { AnthropicProvider } from '@ai-sdk/anthropic'
import type { GoogleGenerativeAIProvider } from '@ai-sdk/google'
import type { OpenAIProvider } from '@ai-sdk/openai'
import type { ZhipuProvider as ZaiProvider } from '@ai-sdk/zai'
import type { ModelMessage } from 'ai'
import type { ZodType } from 'zod'

import type { SUPPORTED_MODEL_PROVIDERS } from './providers'

export interface ModelProvider {
  id: string
  name: string
  description: string
  baseURL: string
  help: { text: string, url: string }
  fetchModels: (options: ModelFetchOptions) => Promise<ModelConfig[]>
  createClient: (options: ModelClientOptions) => Promise<ModelClient>
}

export interface ModelConfig {
  id: string
  name: string
}

export type ModelProviderType = (typeof SUPPORTED_MODEL_PROVIDERS)[number]['id']

export type ModelClient
  = | OpenAIProvider
    | AnthropicProvider
    | GoogleGenerativeAIProvider
    | ZaiProvider

export interface ModelFetchOptions {
  apiKey: string
  baseURL: string
}

export type ModelClientOptions = {
  provider: ModelProviderType
} & ModelFetchOptions

export type GenerateSchemaOutputOptions<T> = {
  model: string
  systemPrompt: string
  userPrompt: string
  schema: ZodType<T>
  abortSignal?: AbortSignal
} & ModelClientOptions

export type GenerateStreamSchemaOutputOptions<T> = {
  messages?: ModelMessage[]
} & Omit<GenerateSchemaOutputOptions<T>, 'userPrompt'>
