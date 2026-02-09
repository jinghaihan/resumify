import type { Resume } from '@resumify/shared'
import { nanoid } from 'nanoid'

interface CacheResumeData {
  resume: Resume
  expiresAt: number
}

const cacheStorage = new Map<string, CacheResumeData>()

setInterval(() => {
  const now = Date.now()
  for (const [token, data] of cacheStorage.entries()) {
    if (data.expiresAt < now)
      cacheStorage.delete(token)
  }
}, 60 * 1000)

export function createTempResume(resume: Resume): string {
  const token = nanoid()
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

  cacheStorage.set(token, { resume, expiresAt })

  return token
}

export function getTempResume(token: string): Resume | null {
  const data = cacheStorage.get(token)

  if (!data)
    return null

  if (data.expiresAt < Date.now()) {
    cacheStorage.delete(token)
    return null
  }

  cacheStorage.delete(token)

  return data.resume
}
