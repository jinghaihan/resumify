import { z } from 'zod'

export const personalInfoSchema = z.object({
  id: z.string(),
  icon: z.string(),
  name: z.string(),
  value: z.string(),
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>
