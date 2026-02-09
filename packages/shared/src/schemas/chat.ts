import { z } from 'zod'

export const resumeChatStatusSchema = z.object({
  status: z.enum(['updating', 'error']),
})

export type ResumeChatStatus = z.infer<typeof resumeChatStatusSchema>

export const chatTitleSchema = z.object({
  title: z.string().min(1),
})

export type ChatTitle = z.infer<typeof chatTitleSchema>

export const chatIntentSchema = z.object({
  intent: z.enum(['chat', 'update']),
})

export type ChatIntent = z.infer<typeof chatIntentSchema>
