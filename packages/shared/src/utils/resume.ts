import type { ZodError } from 'zod'
import type { Resume } from '../schemas/resume'
import { resumeSchema } from '../schemas/resume'

export function validateResume(data: unknown): {
  success: boolean
  data?: Resume
  errors?: ZodError
} {
  const result = resumeSchema.safeParse(data)
  if (result.success)
    return { success: true, data: result.data }
  console.error(result.error)
  return { success: false, errors: result.error }
}

export function sanitizeResume(resume: Resume): Resume {
  return {
    ...resume,
    photoUrl: undefined,
  }
}
