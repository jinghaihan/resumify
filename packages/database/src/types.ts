import type {
  account,
  session,
  user,
  verification,
} from './schemas/auth'
import type { resume } from './schemas/resume'
import type { share } from './schemas/share'

export interface Resetable {
  reset: () => Promise<void>
}

export type DatabaseAccount = typeof account.$inferSelect
export type DatabaseSession = typeof session.$inferSelect
export type DatabaseUser = typeof user.$inferSelect
export type DatabaseVerification = typeof verification.$inferSelect

export type DatabaseResume = typeof resume.$inferSelect
export type DatabaseShare = typeof share.$inferSelect

export type DatabaseResumeListItem = Pick<DatabaseResume, 'id' | 'name' | 'createdAt' | 'updatedAt'>

export type DatabaseShareListItem = Omit<DatabaseShare, 'resumeData' | 'password'>

export interface CreateShareOptions {
  shareName: string
  resumeName: string
  resumeData: string
  isOneTime?: boolean
  password?: string
  expiresAt?: Date
}

export type UpdateShareOptions = Pick<CreateShareOptions, 'shareName' | 'expiresAt' | 'password'>
