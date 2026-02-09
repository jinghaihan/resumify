import type { Resume } from '@resumify/shared'
import type { NextRequest } from 'next/server'
import { requestInterceptor } from '@resumify/auth/server'
import { resumeService } from '@resumify/database'
import { NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

async function GETHandler(userId: string, request: NextRequest, context?: RouteContext) {
  const { id } = await (context?.params ?? Promise.resolve({ id: '' }))
  const resume = await resumeService.detail(userId, id)

  if (!resume)
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  return NextResponse.json(resume)
}

export interface UpdateResumeBody {
  id: string
  resumeName?: string
  name?: string
  resume?: Resume
}

async function PUTHandler(userId: string, request: NextRequest, context?: RouteContext) {
  try {
    const { id } = await (context?.params ?? Promise.resolve({ id: '' }))
    const body = await request.json() as UpdateResumeBody

    if (body.resumeName && body.resume) {
      let result = await resumeService.save(
        userId,
        body.resumeName,
        body.resume,
        id,
      )

      // If result is undefined, the record doesn't exist, create a new one
      if (!result) {
        result = await resumeService.save(
          userId,
          body.resumeName,
          body.resume,
        )
      }

      if (!result)
        return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 })
      return NextResponse.json(result)
    }

    if (body.name) {
      const result = await resumeService.rename(userId, id, body.name)
      if (!result)
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  catch (error) {
    console.error('PUT /api/resumes/[id] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

async function DELETEHandler(userId: string, request: NextRequest, context?: RouteContext) {
  const { id } = await (context?.params ?? Promise.resolve({ id: '' }))
  await resumeService.delete(userId, id)
  return new NextResponse(null, { status: 204 })
}

export const GET = requestInterceptor(GETHandler)
export const PUT = requestInterceptor(PUTHandler)
export const DELETE = requestInterceptor(DELETEHandler)
