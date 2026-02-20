import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const resume = pgTable('resume', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().default('Untitled Resume'),
  data: jsonb('data').notNull().default('{}'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})
