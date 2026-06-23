'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Navbar from '@/presentation/components/Navbar'
import { User } from '@/domain/entities/User'
import { useAuthStore } from '@/presentation/store/authStore'

export default function ProfilePage() {
  const setUser = useAuthStore((state) => state.setUser)

  const [user, setLocalUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageFailed, setImageFailed] = useState(false)

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile')

      if (!response.ok) {
        throw new Error('Profile request failed')
      }

      const result: User = await response.json()
      setLocalUser(result)
      setUser(result)
    } catch (err) {
      setError('Could not load your profile, please try again')
    } finally {
      setIsLoading(false)
    }
  }, [setUser])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
          <p className="text-sm text-muted">Loading your profile...</p>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="w-full max-w-sm bg-surface border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-danger mb-4">{error}</p>
            <button
              onClick={loadProfile}
              className="w-full bg-accent text-white font-medium py-2 rounded-md"
            >
              Retry
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm bg-surface border border-border rounded-lg p-8">
          <div className="flex flex-col items-center mb-6">
            {!imageFailed && user?.image ? (
              <Image
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                width={72}
                height={72}
                className="rounded-full mb-3"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-accent-soft flex items-center justify-center text-accent text-xl font-medium mb-3">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
            )}
            <p className="text-lg font-medium text-ink">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>

          <div className="border-t border-border pt-4 text-sm">
            <div className="flex justify-between py-1.5">
              <span className="text-muted">First name</span>
              <span className="text-ink">{user?.firstName}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted">Last name</span>
              <span className="text-ink">{user?.lastName}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted">Gender</span>
              <span className="text-ink">{user?.gender}</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}