import type { ChatStatus, UIMessage } from 'ai'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@shadcn/components/ai-elements/conversation'
import { Loader } from '@shadcn/components/ai-elements/loader'
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from '@shadcn/components/ai-elements/message'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@shadcn/components/ai-elements/reasoning'
import { Shimmer } from '@shadcn/components/ai-elements/shimmer'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@shadcn/components/ai-elements/sources'
import { CircleStopIcon, CopyIcon, RefreshCcwIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MessagesProps {
  messages: UIMessage[]
  status: ChatStatus
  regenerate: () => void
  isUpdatingResume: boolean
  onAbort: () => void
}

export function Messages({ messages, status, regenerate, isUpdatingResume, onAbort }: MessagesProps) {
  const t = useTranslations()
  const canAbort = status === 'streaming' || isUpdatingResume
  const lastMessage = messages.at(-1)
  const lastTextPart = lastMessage?.parts
    ? [...lastMessage.parts].reverse().find(part => part.type === 'text')
    : undefined
  const isWaitingForFirstToken = status === 'streaming'
    && lastMessage?.role === 'assistant'
    && (!lastTextPart || lastTextPart.text.length === 0)

  return (
    <Conversation className="h-full">
      <ConversationContent className="gap-4 p-0">
        {messages.map(message => (
          <div key={message.id}>
            {message.role === 'assistant' && message.parts.filter(part => part.type === 'source-url').length > 0 && (
              <Sources>
                <SourcesTrigger
                  count={
                    message.parts.filter(
                      part => part.type === 'source-url',
                    ).length
                  }
                />
                {message.parts.filter(part => part.type === 'source-url').map((part, i) => (
                  <SourcesContent key={`${message.id}-${i}`}>
                    <Source
                      key={`${message.id}-${i}`}
                      href={part.url}
                      title={part.url}
                    />
                  </SourcesContent>
                ))}
              </Sources>
            )}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return (
                    <Message key={`${message.id}-${i}`} from={message.role}>
                      <MessageContent>
                        <MessageResponse>
                          {part.text}
                        </MessageResponse>
                      </MessageContent>
                      {message.role === 'assistant' && i === messages.length - 1 && (
                        <MessageActions>
                          {canAbort && (
                            <MessageAction
                              onClick={onAbort}
                              label={t('chat.abort')}
                            >
                              <CircleStopIcon className="size-3" />
                            </MessageAction>
                          )}
                          <MessageAction
                            onClick={() => regenerate()}
                            label={t('chat.retry')}
                          >
                            <RefreshCcwIcon className="size-3" />
                          </MessageAction>
                          <MessageAction
                            onClick={() =>
                              navigator.clipboard.writeText(part.text)}
                            label={t('chat.copy')}
                          >
                            <CopyIcon className="size-3" />
                          </MessageAction>
                        </MessageActions>
                      )}
                    </Message>
                  )
                case 'reasoning':
                  return (
                    <Reasoning
                      key={`${message.id}-${i}`}
                      className="w-full"
                      isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                    >
                      <ReasoningTrigger />
                      <ReasoningContent>{part.text}</ReasoningContent>
                    </Reasoning>
                  )
                default:
                  return null
              }
            })}
          </div>
        ))}
        {isUpdatingResume && (
          <Message from="assistant">
            <MessageContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader size={14} />
                <span>{t('chat.updating-resume')}</span>
              </div>
            </MessageContent>
          </Message>
        )}
        {isWaitingForFirstToken && (
          <Message from="assistant">
            <MessageContent>
              <Shimmer className="text-xs">
                {t('chat.thinking')}
              </Shimmer>
            </MessageContent>
          </Message>
        )}
        {status === 'submitted' && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}
