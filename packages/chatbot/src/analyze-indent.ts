import type { AIService } from '@resumify/ai'
import { chatIntentSchema } from '@resumify/shared'
import { buildAnalyzeIntentSystemPrompt } from './prompts'

interface AnalyzeIntentOptions {
  ai: AIService
  provider: string
  apiKey: string
  baseURL: string
  model: string
  abortSignal: AbortSignal
  userPrompt: string
}

export async function analyzeIntent(options: AnalyzeIntentOptions): Promise<'chat' | 'update'> {
  const output = await options.ai.generateSchemaOutput({
    provider: options.provider,
    apiKey: options.apiKey,
    baseURL: options.baseURL,
    model: options.model,
    systemPrompt: buildAnalyzeIntentSystemPrompt(),
    userPrompt: options.userPrompt,
    schema: chatIntentSchema,
    abortSignal: options.abortSignal,
  })

  return output.intent === 'update' ? 'update' : 'chat'
}
