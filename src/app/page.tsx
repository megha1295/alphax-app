import { redirect } from 'next/navigation'
import { getSession } from '@/data/storage/session'

export default function RootPage() {
  const session = getSession()

  if (session && session.isVerified) {
    redirect('/profile')
  }

  redirect('/login')
}