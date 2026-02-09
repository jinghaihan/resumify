'use client'

import type { PromptInputMessage } from '@shadcn/components/ai-elements/prompt-input'
import type { ChatStatus, UIMessage } from 'ai'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@shadcn/components/ai-elements/prompt-input'
import { SendIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { ChatHistoryDrawer } from './history-drawer'
import { ModelSelectorCompact } from './model-selector'

interface SenderProps {
  status: ChatStatus
  isUpdatingResume: boolean
  onSubmit: (message: PromptInputMessage, model: string) => void | Promise<void>
  onRestoreHistory: (messages: UIMessage[]) => void
  onActiveHistoryChange: (id: string | null) => void
  activeHistoryId: string | null
}

function isValidMessage(message: PromptInputMessage): boolean {
  return Boolean(message.text || message.files?.length)
}

export function Sender({
  status,
  onSubmit,
  isUpdatingResume,
  onRestoreHistory,
  onActiveHistoryChange,
  activeHistoryId,
}: SenderProps) {
  const t = useTranslations()
  const [input, setInput] = useState('')
  const [model, setModel] = useState<string | undefined>(undefined)

  const handleModelChange = useCallback((modelId: string) => {
    setModel(modelId)
  }, [])

  function handleSubmit(message: PromptInputMessage) {
    if (!isValidMessage(message) || !model) {
      return
    }

    onSubmit(message, model)
    setInput('')
  }

  const isDisabled = !input || !model || status === 'submitted' || status === 'streaming' || isUpdatingResume

  return (
    <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
      <PromptInputBody>
        <PromptInputTextarea
          onChange={e => setInput(e.target.value)}
          placeholder={t('chat.placeholder')}
          value={input}
        />
      </PromptInputBody>

      <PromptInputFooter>
        <PromptInputTools>
          <ChatHistoryDrawer
            onRestore={onRestoreHistory}
            onActiveChange={onActiveHistoryChange}
            activeId={activeHistoryId}
          />
          <ModelSelectorCompact selectedModelId={model} onModelChange={handleModelChange} />
        </PromptInputTools>

        <PromptInputSubmit variant="ghost" disabled={isDisabled} status={status}>
          <SendIcon className="size-4" />
        </PromptInputSubmit>
      </PromptInputFooter>
    </PromptInput>
  )
}
