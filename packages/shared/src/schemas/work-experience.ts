import { z } from 'zod'

export const workExperienceSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  achievements: z.string(),
})

export type WorkExperience = z.infer<typeof workExperienceSchema>
