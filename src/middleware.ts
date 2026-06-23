import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'alphax_session'
const PROTECTED_PATHS = ['/profile', '/products', '/cart']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(COOKIE_NAME)

  if (!cookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const session = JSON.parse(cookie.value)
    if (!session.isVerified) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/products/:path*', '/cart/:path*'],
}