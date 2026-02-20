import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const share = pgTable('share', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: uuid('token').notNull().unique().defaultRandom(),

  shareName: text('share_name').notNull().default('Untitled Share'),
  resumeName: text('resume_name').notNull(),
  resumeData: jsonb('resume_data').notNull().default('{}'),

  password: text('password'),
  expiresAt: timestamp('expires_at'),
  isOneTime: boolean('is_one_time').notNull().default(false),

  isActive: boolean('is_active').notNull().default(true),
  viewCount: integer('view_count').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),

  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})
