'use client'

import type { UIMessage } from 'ai'
import { chatTitleSchema } from '@resumify/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createChatHistory,
  getActiveChatHistoryId,
  renameChatHistory,
  saveChatHistory,
  setActiveChatHistoryId,
} from '../storage'

interface UseChatHistoryOptions {
  messages: UIMessage[]
  setMessages: (messages: UIMessage[]) => void
  setIsUpdatingResume: (value: boolean) => void
}

export function useChatHistory({
  messages,
  setMessages,
  setIsUpdatingResume,
}: UseChatHistoryOptions) {
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(() => getActiveChatHistoryId())
  const [queuedTitle, setQueuedTitle] = useState<string | null>(null)
  const creatingHistoryRef = useRef(false)

  const handleChatTitlePart = useCallback((part: { data: unknown }) => {
    const titleResult = chatTitleSchema.safeParse(part.data)
    if (!titleResult.success)
      return
    const nextTitle = titleResult.data.title.trim()
    if (!nextTitle)
      return
    if (activeHistoryId) {
      void renameChatHistory(activeHistoryId, nextTitle)
    }
    else {
      setQueuedTitle(nextTitle)
    }
  }, [activeHistoryId])

  const handleRestoreHistory = useCallback((restored: UIMessage[]) => {
    setIsUpdatingResume(false)
    setMessages(restored)
  }, [setIsUpdatingResume, setMessages])

  useEffect(() => {
    if (messages.length === 0 || activeHistoryId)
      return
    if (creatingHistoryRef.current)
      return

    let cancelled = false
    creatingHistoryRef.current = true
    const create = async () => {
      const created = await createChatHistory(messages)
      if (cancelled || !created)
        return
      setActiveHistoryId(created.id)
      if (queuedTitle) {
        await renameChatHistory(created.id, queuedTitle)
        setQueuedTitle(null)
      }
      creatingHistoryRef.current = false
    }
    void create()
    return () => {
      cancelled = true
      creatingHistoryRef.current = false
    }
  }, [messages, activeHistoryId, queuedTitle])

  useEffect(() => {
    if (messages.length === 0 || !activeHistoryId)
      return
    void saveChatHistory(activeHistoryId, messages)
  }, [messages, activeHistoryId])

  useEffect(() => {
    setActiveChatHistoryId(activeHistoryId)
  }, [activeHistoryId])

  return {
    activeHistoryId,
    setActiveHistoryId,
    handleChatTitlePart,
    handleRestoreHistory,
  }
}
