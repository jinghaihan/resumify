import type { DatabaseResume, DatabaseShare, DatabaseShareListItem } from '@resumify/database'
import type { Resume } from '@resumify/shared'
import { ofetch } from 'ofetch'

export async function fetchShares(name: string): Promise<DatabaseShareListItem> {
  return await ofetch('/api/shares', {
    query: { name },
  })
}

interface CreateSharePayload {
  shareName: string
  resumeData: Resume
  resumeName: string
  isOneTime?: boolean
  expiresAt?: string | null
  password?: string
}

export async function createShare(payload: CreateSharePayload): Promise<DatabaseResume> {
  return await ofetch('/api/shares', {
    method: 'POST',
    body: payload,
  })
}

type UpdateSharePayload = {
  id: string
} & Pick<CreateSharePayload, 'shareName' | 'expiresAt' | 'password'>

export async function updateShare(payload: UpdateSharePayload): Promise<DatabaseResume> {
  return await ofetch(`/api/shares/${payload.id}`, {
    method: 'PUT',
    body: payload,
  })
}

export async function deleteShare(id: string): Promise<void> {
  return await ofetch(`/api/shares/${id}`, {
    method: 'DELETE',
  })
}

export async function toggleShareActive(id: string): Promise<DatabaseShare> {
  return await ofetch(`/api/shares/${id}/active`, {
    method: 'PUT',
  })
}

interface VerifySharePayload {
  token: string
  password: string
}

interface VerifyShareResponse {
  isValid: boolean
}

export async function verifyShare(payload: VerifySharePayload): Promise<boolean> {
  const result = await ofetch<VerifyShareResponse>('/api/shares/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  })
  return result.isValid
}
