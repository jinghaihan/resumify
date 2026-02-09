'use client'

import type { Resume } from '@resumify/shared'
import type { UIMessage } from 'ai'
import type { Table } from 'dexie'
import { APPLICATION_NAME, isBrowser } from '@resumify/shared'
import Dexie from 'dexie'

const CHATBOT_DB_NAME = `${APPLICATION_NAME}-chatbot`
const CHAT_HISTORY_ACTIVE_ID_KEY = `${CHATBOT_DB_NAME}-active-id`
const SNAPSHOT_LIMIT = 20

interface ChatHistoryRecord {
  id: string
  title: string
  messages: UIMessage[]
  createdAt: number
  updatedAt: number
}

export interface ChatHistorySummary {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messageCount: number
}

export interface ResumeSnapshot {
  id?: number
  before: Resume
  after: Resume
  createdAt: number
}

class ChatbotDb extends Dexie {
  history!: Table<ChatHistoryRecord, string>
  snapshots!: Table<ResumeSnapshot, number>

  constructor() {
    super(CHATBOT_DB_NAME)
    this.version(1).stores({
      history: 'id, updatedAt',
      snapshots: '++id, createdAt',
    })
  }
}

let chatbotDb: ChatbotDb | null = null

function getChatbotDb() {
  if (!chatbotDb)
    chatbotDb = new ChatbotDb()
  return chatbotDb
}

function normalizeTitle(title: string) {
  const trimmed = title.trim()
  if (!trimmed)
    return 'Untitled'
  return trimmed
}

function isTextPart(part: unknown): part is { type: 'text', text: string } {
  if (!part || typeof part !== 'object')
    return false
  if (!('type' in part) || !('text' in part))
    return false
  const maybeType = (part as { type?: unknown }).type
  const maybeText = (part as { text?: unknown }).text
  return maybeType === 'text' && typeof maybeText === 'string'
}

function deriveTitle(messages: UIMessage[]) {
  const userMessage = messages.find(message => message.role === 'user')
  if (!userMessage)
    return 'Untitled'

  const textPart = userMessage.parts?.find(isTextPart)
  if (textPart)
    return normalizeTitle(textPart.text)

  return 'Untitled'
}

function toSummary(record: ChatHistoryRecord): ChatHistorySummary {
  return {
    id: record.id,
    title: record.title,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    messageCount: record.messages.length,
  }
}

function createHistoryId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getActiveChatHistoryId(): string | null {
  if (!isBrowser())
    return null
  return localStorage.getItem(CHAT_HISTORY_ACTIVE_ID_KEY)
}

export function setActiveChatHistoryId(id: string | null) {
  if (!isBrowser())
    return
  if (!id) {
    localStorage.removeItem(CHAT_HISTORY_ACTIVE_ID_KEY)
    return
  }
  localStorage.setItem(CHAT_HISTORY_ACTIVE_ID_KEY, id)
}

export async function listChatHistories(): Promise<ChatHistorySummary[]> {
  if (!isBrowser())
    return []

  const db = getChatbotDb()
  const records = await db.history.orderBy('updatedAt').reverse().toArray()
  return records.map(toSummary)
}

export async function loadChatHistory(id: string): Promise<UIMessage[] | null> {
  if (!isBrowser())
    return null

  const db = getChatbotDb()
  const record = await db.history.get(id)
  if (!record)
    return null
  return record.messages
}

export async function createChatHistory(messages: UIMessage[], titleOverride?: string): Promise<ChatHistorySummary | null> {
  if (!isBrowser())
    return null

  const db = getChatbotDb()
  const createdAt = Date.now()
  const record: ChatHistoryRecord = {
    id: createHistoryId(),
    title: titleOverride ? normalizeTitle(titleOverride) : deriveTitle(messages),
    messages,
    createdAt,
    updatedAt: createdAt,
  }
  await db.history.put(record)
  setActiveChatHistoryId(record.id)
  return toSummary(record)
}

export async function saveChatHistory(id: string, messages: UIMessage[]): Promise<ChatHistorySummary | null> {
  if (!isBrowser())
    return null

  const db = getChatbotDb()
  const existing = await db.history.get(id)
  const updatedAt = Date.now()

  if (!existing) {
    const record: ChatHistoryRecord = {
      id,
      title: deriveTitle(messages),
      messages,
      createdAt: updatedAt,
      updatedAt,
    }
    await db.history.put(record)
    return toSummary(record)
  }

  const record: ChatHistoryRecord = {
    ...existing,
    title: existing.title || deriveTitle(messages),
    messages,
    updatedAt,
  }
  await db.history.put(record)
  return toSummary(record)
}

export async function renameChatHistory(id: string, title: string): Promise<ChatHistorySummary | null> {
  if (!isBrowser())
    return null

  const db = getChatbotDb()
  const record = await db.history.get(id)
  if (!record)
    return null

  const updated: ChatHistoryRecord = {
    ...record,
    title: normalizeTitle(title),
    updatedAt: Date.now(),
  }
  await db.history.put(updated)
  return toSummary(updated)
}

export async function deleteChatHistory(id: string) {
  if (!isBrowser())
    return

  const db = getChatbotDb()
  await db.history.delete(id)
}

export async function clearChatHistory() {
  if (!isBrowser())
    return

  const db = getChatbotDb()
  await db.history.clear()
}

export async function getResumeSnapshots(limit = SNAPSHOT_LIMIT): Promise<ResumeSnapshot[]> {
  if (!isBrowser())
    return []

  const db = getChatbotDb()
  return await db.snapshots
    .orderBy('createdAt')
    .reverse()
    .limit(limit)
    .toArray()
}

async function pruneSnapshots(limit = SNAPSHOT_LIMIT) {
  const db = getChatbotDb()
  const total = await db.snapshots.count()
  if (total <= limit)
    return

  const ids = await db.snapshots
    .orderBy('createdAt')
    .reverse()
    .offset(limit)
    .primaryKeys()
  if (ids.length > 0)
    await db.snapshots.bulkDelete(ids)
}

export async function addResumeSnapshot(snapshot: ResumeSnapshot) {
  if (!isBrowser())
    return

  const db = getChatbotDb()
  await db.snapshots.add(snapshot)
  await pruneSnapshots()
}

export async function deleteResumeSnapshot(id: number) {
  if (!isBrowser())
    return

  const db = getChatbotDb()
  await db.snapshots.delete(id)
}
