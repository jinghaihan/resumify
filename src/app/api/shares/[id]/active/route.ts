import type { NextRequest } from 'next/server'
import { requestInterceptor } from '@resumify/auth/server'
import { shareService } from '@resumify/database'
import { NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

async function PUTHandler(userId: string, request: NextRequest, context?: RouteContext) {
  const { id } = await (context?.params ?? Promise.resolve({ id: '' }))
  const result = await shareService.toggleActive(userId, id)
  return NextResponse.json(result)
}

export const PUT = requestInterceptor(PUTHandler)
