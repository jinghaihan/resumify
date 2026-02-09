import type { NextRequest } from 'next/server'
import { requestInterceptor } from '@resumify/auth/server'
import { resumeService } from '@resumify/database'
import { NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export interface DuplicateResumeBody {
  id: string
  name: string
}

async function POSTHandler(userId: string, request: NextRequest, context?: RouteContext) {
  const { id } = await (context?.params ?? Promise.resolve({ id: '' }))
  const body = await request.json() as DuplicateResumeBody

  const result = await resumeService.duplicate(userId, id, body.name)
  return NextResponse.json(result)
}

export const POST = requestInterceptor(POSTHandler)
