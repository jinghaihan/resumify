import type { AIService } from '@resumify/ai'
import { chatTitleSchema } from '@resumify/shared'

import { buildChatTitlePrompt } from './prompts'

interface GenerateTitleOptions {
  ai: AIService
  provider: string
  apiKey: string
  baseURL: string
  model: string
  abortSignal: AbortSignal
  message: string
}

export async function generateTitle(options: GenerateTitleOptions): Promise<string> {
  const output = await options.ai.generateSchemaOutput<{ title: string }>({
    provider: options.provider,
    apiKey: options.apiKey,
    baseURL: options.baseURL,
    model: options.model,
    systemPrompt: 'You create short titles for chat history.',
    userPrompt: buildChatTitlePrompt(options.message),
    schema: chatTitleSchema,
    abortSignal: options.abortSignal,
  })

  return output.title?.trim() || 'Untitled Chat'
}
