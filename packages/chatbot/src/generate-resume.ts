import type { AIService } from '@resumify/ai'
import type { Resume } from '@resumify/shared'
import { resumeSchema } from '@resumify/shared'

import { buildResumeUpdateSystemPrompt } from './prompts'

interface GenerateResumeOptions {
  ai: AIService
  provider: string
  apiKey: string
  baseURL: string
  model: string
  abortSignal: AbortSignal
  message: string
  resume: Resume
}

export async function generateResume(options: GenerateResumeOptions): Promise<Resume> {
  const output = await options.ai.generateSchemaOutput({
    provider: options.provider,
    apiKey: options.apiKey,
    baseURL: options.baseURL,
    model: options.model,
    systemPrompt: buildResumeUpdateSystemPrompt(options.resume),
    userPrompt: options.message,
    schema: resumeSchema,
    abortSignal: options.abortSignal,
  })
  return output
}
