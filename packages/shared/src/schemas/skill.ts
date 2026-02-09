import { z } from 'zod'

export const skillSchema = z.object({
  id: z.string(),
  content: z.string(),
})

export type Skill = z.infer<typeof skillSchema>
