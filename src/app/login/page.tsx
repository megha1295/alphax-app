'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl'
import { loginUser, ValidationError } from '@/domain/usecases/loginUser'
import { useAuthStore } from '@/presentation/store/authStore'

const authRepository = new AuthRepositoryImpl()

export default function LoginPage() {
  const router = useRouter()
  const setPendingAccessToken = useAuthStore((state) => state.setPendingAccessToken)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const passwordIsLongEnough = password.length >= 6

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await loginUser(authRepository, { username, password })

      setPendingAccessToken(result.accessToken)

      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: result.accessToken, isVerified: false }),
      })

      router.push('/otp')
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message)
      } else {
        setError('Invalid username or password, please try again')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface border border-border rounded-lg p-8"
      >
        <h1 className="text-2xl font-medium text-ink mb-1">Welcome back</h1>
        <p className="text-sm text-muted mb-6">Sign in to continue</p>

        <label className="block text-sm text-muted mb-1" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full mb-4 px-3 py-2 border border-border-strong rounded-md bg-white text-ink"
        />

        <label className="block text-sm text-muted mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="w-full mb-2 px-3 py-2 border border-border-strong rounded-md bg-white text-ink"
        />

        {password.length > 0 && (
          <p className={`text-xs mb-4 ${passwordIsLongEnough ? 'text-accent' : 'text-danger'}`}>
            {passwordIsLongEnough ? 'Meets minimum length' : 'Needs at least 6 characters'}
          </p>
        )}

        {error && <p className="text-sm text-danger mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent text-white font-medium py-2 rounded-md disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}