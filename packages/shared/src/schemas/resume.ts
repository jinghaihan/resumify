import { z } from 'zod'

import { personalInfoSchema } from './personal-info'
import { projectExperienceSchema } from './project-experience'
import { sectionSchema } from './section'
import { skillSchema } from './skill'
import { workExperienceSchema } from './work-experience'

export const resumePresentationSchema = z.object({
  theme: z.string(),
  themeConfig: z.object({
    layout: z.string(),
    personalInfoLayout: z.string(),
    experienceHeaderLayout: z.string(),
    techStackStyle: z.object({
      background: z.string(),
      shape: z.string(),
    }),
    typography: z.string(),
  }),
  sectionDistribution: z.record(z.string(), z.array(z.string())),
})

export const resumeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  jobObjective: z.string(),
  photoUrl: z.string().optional(),
  photoShape: z.string().optional().default('square'),
  personalInfo: z.array(personalInfoSchema),
  socialLinks: z.array(personalInfoSchema),
  skills: z.array(skillSchema),
  workExperiences: z.array(workExperienceSchema),
  projectExperiences: z.array(projectExperienceSchema),
  sections: z.array(sectionSchema),
  presentation: resumePresentationSchema,
})

export type Resume = z.infer<typeof resumeSchema>
