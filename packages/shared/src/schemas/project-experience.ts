import { z } from 'zod'
import { workExperienceSchema } from './work-experience'

export const projectExperienceSchema = workExperienceSchema.extend({
  techStack: z.array(z.string()),
})

export type ProjectExperience = z.infer<typeof projectExperienceSchema>
