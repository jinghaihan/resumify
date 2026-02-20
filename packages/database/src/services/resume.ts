import type { DatabaseResume, DatabaseResumeListItem, Resetable } from '../types'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db'
import { resume } from '../schemas'

class ResumeService implements Resetable {
  async reset(): Promise<void> {
    await db.delete(resume).execute()
  }

  async save(userId: string, name: string, data: Record<string, unknown>, id?: string): Promise<DatabaseResume> {
    if (id)
      return this.update(userId, name, data, id)
    return this.create(userId, name, data)
  }

  async create(userId: string, name: string, data: Record<string, unknown>): Promise<DatabaseResume> {
    const [created] = await db
      .insert(resume)
      .values({
        userId,
        name,
        data,
      })
      .returning()
    return created
  }

  async duplicate(userId: string, id: string, name?: string): Promise<DatabaseResume> {
    const resumeData = await this.detail(userId, id)
    if (!resumeData || resumeData.userId !== userId)
      throw new Error('resume not found or unauthorized')

    const [duplicated] = await db
      .insert(resume)
      .values({
        userId,
        name: name?.trim() || `${resume.name} (Copy)`,
        data: resumeData.data,
      })
      .returning()

    return duplicated
  }

  async update(userId: string, name: string, data: Record<string, unknown>, id: string): Promise<DatabaseResume> {
    const result = await db
      .update(resume)
      .set({
        data,
        name,
        updatedAt: new Date(),
      })
      .where(and(eq(resume.userId, userId), eq(resume.id, id)))
      .returning()
    const [updated] = result
    return updated
  }

  async rename(userId: string, id: string, name: string): Promise<DatabaseResume> {
    const [updated] = await db
      .update(resume)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(and(eq(resume.userId, userId), eq(resume.id, id)))
      .returning()
    return updated
  }

  async list(userId: string): Promise<DatabaseResumeListItem[]> {
    return db
      .select({
        id: resume.id,
        name: resume.name,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      })
      .from(resume)
      .where(eq(resume.userId, userId))
      .orderBy(desc(resume.updatedAt))
  }

  async detail(userId: string, id: string): Promise<DatabaseResume> {
    const [detail] = await db
      .select()
      .from(resume)
      .where(and(eq(resume.userId, userId), eq(resume.id, id)))
      .limit(1)
    return detail
  }

  async getResumeByIdOnly(id: string): Promise<DatabaseResume> {
    const [detail] = await db
      .select()
      .from(resume)
      .where(eq(resume.id, id))
      .limit(1)
    return detail
  }

  async delete(userId: string, id: string): Promise<void> {
    await db.delete(resume).where(and(eq(resume.userId, userId), eq(resume.id, id)))
  }
}

export const resumeService = new ResumeService()
