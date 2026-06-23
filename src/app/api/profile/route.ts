import { NextResponse } from 'next/server'
import { getSession } from '@/data/storage/session'
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl'
import { fetchCurrentUser } from '@/domain/usecases/fetchCurrentUser'

const authRepository = new AuthRepositoryImpl()

export async function GET() {
  const session = getSession()

  if (!session || !session.isVerified) {
    return NextResponse.json({ error: 'No active session' }, { status: 401 })
  }

  try {
    const user = await fetchCurrentUser(authRepository, session.accessToken)
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: 'Could not fetch profile' }, { status: 502 })
  }
}