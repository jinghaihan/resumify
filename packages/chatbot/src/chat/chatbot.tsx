'use client'

import type { PromptInputMessage } from '@shadcn/components/ai-elements/prompt-input'
import { useChat } from '@ai-sdk/react'
import {
  chatTitleSchema,
  resumeChatStatusSchema,
  resumeSchema,
  sanitizeResume,
} from '@resumify/shared'
import { useAIStore, useResume, useResumeStore } from '@resumify/store'
import { useTranslations } from 'next-intl'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useChatHistory } from '../hooks/use-chat-history'
import { useResumeUpdate } from '../hooks/use-resume-update'
import { Messages } from './messages'
import { Sender } from './sender'

export function ChatBot() {
  const t = useTranslations()

  const { providers } = useAIStore()

  const resumeData = useResume()
  const resumeStore = useResumeStore()

  const [isUpdatingResume, setIsUpdatingResume] = useState(false)

  const handlersRef = useRef({
    handleChatTitlePart: (_part: { data: unknown }) => {},
    handleResumeStatusPart: (_part: { data: unknown }) => {},
    handleResumeUpdatePart: (_part: { data: unknown }) => {},
  })

  const { messages, sendMessage, status, regenerate, stop, setMessages } = useChat({
    dataPartSchemas: {
      'data-chat-title': chatTitleSchema,
      'data-resume-update': resumeSchema,
      'data-resume-update-status': resumeChatStatusSchema,
    },
    onData: (part) => {
      if (part.type === 'data-chat-title') {
        handlersRef.current.handleChatTitlePart(part)
        return
      }

      if (part.type === 'data-resume-update-status') {
        handlersRef.current.handleResumeStatusPart(part)
        return
      }

      if (part.type === 'data-resume-update') {
        handlersRef.current.handleResumeUpdatePart(part)
      }
    },
    onError: () => {
      setIsUpdatingResume(false)
      toast.error(t('status.error'))
    },
  })

  const handleSubmit = useCallback((message: PromptInputMessage, model: string) => {
    const resume = sanitizeResume(resumeData)
    const [provider] = model.split('/')
    const providerConfig = providers[provider]

    if (!providerConfig?.apiKey) {
      toast.error(t('status.error'))
      return
    }

    setIsUpdatingResume(false)
    sendMessage(message, {
      body: {
        modelId: model,
        resume,
        providerConfig: {
          apiKey: providerConfig.apiKey,
          baseURL: providerConfig.baseURL,
        },
      },
    })
  }, [sendMessage, resumeData, providers, t])

  const handleAbort = useCallback(() => {
    stop()
    setIsUpdatingResume(false)
  }, [stop])

  const chatHistory = useChatHistory({
    messages,
    setMessages,
    setIsUpdatingResume,
  })

  const resumeUpdate = useResumeUpdate({
    resumeStore,
    setIsUpdatingResume,
    t,
  })

  handlersRef.current = {
    handleChatTitlePart: chatHistory.handleChatTitlePart,
    handleResumeStatusPart: resumeUpdate.handleResumeStatusPart,
    handleResumeUpdatePart: resumeUpdate.handleResumeUpdatePart,
  }

  return (
    <div className="relative mx-auto flex size-full h-full max-w-4xl flex-col">
      {messages.length === 0 && (
        <div className="flex size-full items-center justify-center text-center">
          <div className="max-w-md space-y-2">
            <p className="text-xl font-medium">{t('chat.empty-title')}</p>
            <p className="text-muted-foreground">{t('chat.empty-description')}</p>
          </div>
        </div>
      )}

      <Messages
        messages={messages}
        status={status}
        regenerate={regenerate}
        isUpdatingResume={isUpdatingResume}
        onAbort={handleAbort}
      />

      <Sender
        status={status}
        onSubmit={handleSubmit}
        isUpdatingResume={isUpdatingResume}
        onRestoreHistory={chatHistory.handleRestoreHistory}
        onActiveHistoryChange={chatHistory.setActiveHistoryId}
        activeHistoryId={chatHistory.activeHistoryId}
      />
    </div>
  )
}
