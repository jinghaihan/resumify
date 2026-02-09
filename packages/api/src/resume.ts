import type { DatabaseResume, DatabaseResumeListItem } from '@resumify/database'
import type { Resume } from '@resumify/shared'
import { ofetch } from 'ofetch'

export async function getResumes(name: string): Promise<DatabaseResumeListItem[]> {
  return await ofetch('/api/resumes', {
    query: { name },
  })
}

interface SaveResumePayload {
  id?: string
  resumeName?: string
  resume: Resume
}

export async function saveResumes(payload: SaveResumePayload): Promise<DatabaseResume> {
  const method = payload.id ? 'PUT' : 'POST'
  const url = payload.id ? `/api/resumes/${payload.id}` : '/api/resumes'
  return await ofetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  })
}

export async function getResumeDetail(id: string): Promise<DatabaseResume> {
  return await ofetch(`/api/resumes/${id}`)
}

interface RenameResumePayload {
  id: string
  name: string
}

export async function renameResume(payload: RenameResumePayload): Promise<DatabaseResume> {
  return await ofetch(`/api/resumes/${payload.id}`, {
    method: 'PUT',
    body: payload,
  })
}

interface DuplicateResumePayload {
  id: string
  name: string
}

export async function duplicateResume(payload: DuplicateResumePayload): Promise<DatabaseResume> {
  return await ofetch(`/api/resumes/${payload.id}/duplicate`, {
    method: 'POST',
    body: payload,
  })
}

export async function deleteResume(id: string): Promise<void> {
  return await ofetch(`/api/resumes/${id}`, {
    method: 'DELETE',
  })
}
