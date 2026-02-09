import type { Resume } from '@resumify/shared'
import type { UIMessage, UIMessageStreamWriter } from 'ai'
import type { NextRequest } from 'next/server'
import { AIService, SUPPORTED_MODEL_PROVIDERS } from '@resumify/ai'
import {
  analyzeIntent,
  buildTextSystemPrompt,
  generateResume,
  generateTitle,
  getLastUserText,
} from '@resumify/chatbot'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from 'ai'

interface ChatProviderConfig {
  apiKey: string
  baseURL?: string
}

interface ChatRequestBody {
  messages: UIMessage[]
  modelId: string
  resume: Resume
  providerConfig: ChatProviderConfig
}

async function POSTHandler(request: NextRequest) {
  const body: ChatRequestBody = await request.json()
  const messages = Array.isArray(body.messages) ? body.messages : []
  const { modelId, resume, providerConfig } = body

  if (!modelId || !providerConfig?.apiKey || !resume)
    return new Response('Missing model or API key', { status: 400 })

  const ai = new AIService()
  const { provider, model } = ai.parseModel(modelId)

  const providerInfo = SUPPORTED_MODEL_PROVIDERS.find(p => p.id === provider)
  const baseURL = providerConfig.baseURL || providerInfo?.baseURL || ''

  const client = await ai.getClient({
    provider,
    apiKey: providerConfig.apiKey,
    baseURL,
  })

  const modelClient = client(model)

  const isFirstMessage = messages.filter(message => message.role === 'user').length === 1
  const userMessage = getLastUserText(messages) || ''
  const modelMessages = await convertToModelMessages(messages)

  const intentResult = await analyzeIntent({
    ai,
    provider,
    apiKey: providerConfig.apiKey,
    baseURL,
    model,
    abortSignal: request.signal,
    userPrompt: userMessage,
  })

  const result = await streamText({
    model: modelClient,
    system: buildTextSystemPrompt(resume),
    messages: modelMessages,
    abortSignal: request.signal,
  })

  const titleGenerator = async (writer: UIMessageStreamWriter) => {
    if (isFirstMessage) {
      const titleResult = await generateTitle({
        ai,
        provider,
        apiKey: providerConfig.apiKey,
        baseURL,
        model,
        abortSignal: request.signal,
        message: userMessage,
      })
      writer.write({
        type: 'data-chat-title',
        data: { title: titleResult },
      })
    }
  }

  const resumeGenerator = async (writer: UIMessageStreamWriter) => {
    if (intentResult !== 'update')
      return

    writer.write({
      type: 'data-resume-update-status',
      data: { status: 'updating' },
    })

    try {
      const resumeOutput = await generateResume({
        ai,
        provider,
        apiKey: providerConfig.apiKey,
        baseURL,
        model,
        abortSignal: request.signal,
        message: userMessage,
        resume,
      })
      writer.write({
        type: 'data-resume-update',
        data: resumeOutput,
      })
    }
    catch {
      writer.write({
        type: 'data-resume-update-status',
        data: { status: 'error' },
      })
    }
  }

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const textId = crypto.randomUUID()

      writer.write({ type: 'text-start', id: textId })
      for await (const delta of result.textStream) {
        if (!delta)
          continue
        writer.write({ type: 'text-delta', id: textId, delta })
      }
      writer.write({ type: 'text-end', id: textId })

      await titleGenerator(writer)
      await resumeGenerator(writer)
    },
  })

  return createUIMessageStreamResponse({ stream })
}

export const POST = POSTHandler
