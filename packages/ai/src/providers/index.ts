import { anthropic } from './anthropic'
import { deepseek } from './deepseek'
import { google } from './google'
import { moonshot } from './moonshot'
import { openai } from './openai'
import { zai } from './zai'

/// keep-sorted
export const SUPPORTED_MODEL_PROVIDERS = [
  anthropic,
  deepseek,
  google,
  moonshot,
  openai,
  zai,
] as const
