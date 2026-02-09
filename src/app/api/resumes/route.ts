import type { Resume } from '@resumify/shared'
import type { NextRequest } from 'next/server'
import { requestInterceptor } from '@resumify/auth/server'
import { resumeService } from '@resumify/database'
import { NextResponse } from 'next/server'

export interface GetResumesQuery {
  name?: string
}

async function GETHandler(userId: string, request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || undefined

  const resumes = await resumeService.list(userId)

  if (name) {
    const filtered = resumes.filter(resume =>
      resume.name.toLowerCase().includes(name.toLowerCase()))
    return NextResponse.json(filtered)
  }

  return NextResponse.json(resumes)
}

export interface CreateResumeBody {
  resumeName: string
  resume: Resume
}

async function POSTHandler(userId: string, request: NextRequest) {
  const body = await request.json() as CreateResumeBody

  const result = await resumeService.save(
    userId,
    body.resumeName,
    body.resume,
  )

  if (!result)
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 })
  return NextResponse.json(result)
}

export const GET = requestInterceptor(GETHandler)
export const POST = requestInterceptor(POSTHandler)
