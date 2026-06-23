import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'alphax_session'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { accessToken, isVerified } = body

  if (!accessToken) {
    return NextResponse.json({ error: 'accessToken is required' }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true })

  response.cookies.set(COOKIE_NAME, JSON.stringify({ accessToken, isVerified: !!isVerified }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}