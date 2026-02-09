import type { NextRequest } from 'next/server'
import { requestInterceptor } from '@resumify/auth/server'
import { shareService } from '@resumify/database'
import { NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

async function GETHandler(userId: string, request: NextRequest, context?: RouteContext) {
  const { id } = await (context?.params ?? Promise.resolve({ id: '' }))
  const share = await shareService.detail(userId, id)

  if (!share) {
    return NextResponse.json({ error: 'Share not found' }, { status: 404 })
  }

  return NextResponse.json(share)
}

export interface UpdateShareBody {
  id: string
  shareName?: string
  expiresAt?: string | null
  password?: string
}

async function PUTHandler(userId: string, request: NextRequest, context?: RouteContext) {
  const { id } = await (context?.params ?? Promise.resolve({ id: '' }))
  const body = await request.json() as UpdateShareBody

  const result = await shareService.update(userId, id, {
    shareName: body.shareName || '',
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    password: body.password,
  })

  return NextResponse.json(result)
}

async function DELETEHandler(userId: string, request: NextRequest, context?: RouteContext) {
  const { id } = await (context?.params ?? Promise.resolve({ id: '' }))
  await shareService.delete(userId, id)
  return new NextResponse(null, { status: 204 })
}

export const GET = requestInterceptor(GETHandler)
export const PUT = requestInterceptor(PUTHandler)
export const DELETE = requestInterceptor(DELETEHandler)
