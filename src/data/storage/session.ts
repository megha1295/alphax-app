import { cookies } from 'next/headers'

const COOKIE_NAME = 'alphax_session'

export interface SessionData {
  accessToken: string
  isVerified: boolean
}

export function getSession(): SessionData | null {
  const cookie = cookies().get(COOKIE_NAME)
  if (!cookie) {
    return null
  }

  try {
    return JSON.parse(cookie.value) as SessionData
  } catch {
    return null
  }
}