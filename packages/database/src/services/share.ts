import type { CreateShareOptions, DatabaseShare, DatabaseShareListItem, Resetable, UpdateShareOptions } from '../types'
import bcrypt from 'bcrypt'
import { and, desc, eq, getTableColumns } from 'drizzle-orm'
import { db } from '../db'
import { share } from '../schemas'

const { resumeData, password, ...safeColumns } = getTableColumns(share)

class ShareService implements Resetable {
  async reset(): Promise<void> {
    await db.delete(share).execute()
  }

  async create(userId: string, options: CreateShareOptions): Promise<DatabaseShare> {
    const encrypted = options.password
      ? await bcrypt.hash(options.password, 10)
      : null

    const [created] = await db
      .insert(share)
      .values({
        userId,
        shareName: options.shareName,
        resumeData: options.resumeData,
        resumeName: options.resumeName,
        isOneTime: options.isOneTime || false,
        expiresAt: options.expiresAt || null,
        password: encrypted,
      })
      .returning()

    return created
  }

  async update(userId: string, id: string, options: UpdateShareOptions): Promise<DatabaseShare> {
    const updateData: Record<string, any> = {
      ...options,
      updatedAt: new Date(),
    }

    if (options.password !== undefined) {
      updateData.password = options.password
        ? await bcrypt.hash(options.password, 10)
        : null
    }
    else {
      delete updateData.password
    }

    const [updated] = await db
      .update(share)
      .set(updateData)
      .where(and(eq(share.userId, userId), eq(share.id, id)))
      .returning()

    return updated
  }

  async list(userId: string): Promise<DatabaseShareListItem[]> {
    return db
      .select(safeColumns)
      .from(share)
      .where(eq(share.userId, userId))
      .orderBy(desc(share.updatedAt))
  }

  async detail(userId: string, id: string): Promise<DatabaseShare> {
    const [detail] = await db
      .select()
      .from(share)
      .where(and(eq(share.userId, userId), eq(share.id, id)))
      .limit(1)
    return detail
  }

  private async _detail(id: string): Promise<DatabaseShare> {
    const [detail] = await db
      .select()
      .from(share)
      .where(eq(share.id, id))
      .limit(1)
    return detail
  }

  async detailByToken(token: string): Promise<DatabaseShare> {
    const [detail] = await db
      .select()
      .from(share)
      .where(eq(share.token, token))
      .limit(1)
    return detail
  }

  async toggleActive(userId: string, id: string): Promise<DatabaseShare> {
    const data = await this.detail(userId, id)
    if (!data)
      throw new Error('share not found')

    const [updated] = await db
      .update(share)
      .set({
        isActive: !data.isActive,
        updatedAt: new Date(),
      })
      .where(and(eq(share.userId, userId), eq(share.id, id)))
      .returning()

    return updated
  }

  async delete(userId: string, id: string): Promise<void> {
    await db
      .delete(share)
      .where(and(eq(share.id, id), eq(share.userId, userId)))
  }

  async incrementViewCount(id: string): Promise<void> {
    const data = await this._detail(id)
    if (!data || !data.isActive)
      throw new Error('share not found or inactive')

    await db
      .update(share)
      .set({
        viewCount: data.viewCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(share.id, id))
  }

  async verify(id: string, password: string): Promise<boolean> {
    const data = await this._detail(id)
    if (!data || !data.password)
      return false

    const result = await bcrypt.compare(password, data.password)
    if (result)
      return true

    return await bcrypt.compare(password.trim(), data.password)
  }

  async isAccessible(id: string) {
    const data = await this._detail(id)
    if (!data || !data.isActive)
      return false
    if (data.expiresAt && data.expiresAt < new Date())
      return false
    return true
  }
}

export const shareService = new ShareService()
