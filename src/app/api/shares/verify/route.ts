import type { NextRequest } from 'next/server'

import process from 'node:process'
import { shareService } from '@resumify/database'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export interface VerifyShareBody {
  token: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as VerifyShareBody

    const share = await shareService.detailByToken(body.token)
    if (!share)
      return NextResponse.json({ isValid: false, error: 'Share not found' }, { status: 404 })

    const isValid = await shareService.verify(share.id, body.password)

    if (isValid) {
      const cookieStore = await cookies()
      cookieStore.set(`share_verify_${body.token}`, 'verified', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })
    }

    return NextResponse.json({ isValid })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ isValid: false, error: message }, { status: 400 })
  }
}
