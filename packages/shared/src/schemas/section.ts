import { z } from 'zod'

export const sectionSchema = z.object({
  id: z.string(),
  content: z.string(),
})

export type Section = z.infer<typeof sectionSchema>
