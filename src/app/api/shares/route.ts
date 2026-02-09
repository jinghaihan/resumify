import type { Resume } from '@resumify/shared'
import type { NextRequest } from 'next/server'
import { requestInterceptor } from '@resumify/auth/server'
import { shareService } from '@resumify/database'
import { NextResponse } from 'next/server'

async function GETHandler(userId: string, request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || undefined

  const shares = await shareService.list(userId)

  if (name) {
    const filtered = shares.filter(share =>
      share.shareName.toLowerCase().includes(name.toLowerCase()))
    return NextResponse.json(filtered)
  }

  return NextResponse.json(shares)
}

export interface CreateShareBody {
  shareName: string
  resumeData: Resume
  resumeName: string
  isOneTime?: boolean
  expiresAt?: string | null
  password?: string
}

async function POSTHandler(userId: string, request: NextRequest) {
  const body = await request.json() as CreateShareBody

  const result = await shareService.create(userId, {
    shareName: body.shareName,
    resumeData: JSON.stringify(body.resumeData),
    resumeName: body.resumeName,
    isOneTime: body.isOneTime,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    password: body.password,
  })

  return NextResponse.json(result)
}

export const GET = requestInterceptor(GETHandler)
export const POST = requestInterceptor(POSTHandler)
