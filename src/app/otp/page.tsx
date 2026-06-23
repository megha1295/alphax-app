'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { verifyOtp, InvalidOtpError } from '@/domain/usecases/verifyOtp'
import { useAuthStore } from '@/presentation/store/authStore'

const RESEND_SECONDS = 60

export default function OtpPage() {
  const router = useRouter()
  const pendingAccessToken = useAuthStore((state) => state.pendingAccessToken)
//   const markVerified = useAuthStore((state) => state.markVerified)

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (secondsLeft === 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  function handleChange(index: number, value: string) {
    debugger
    if (value && !/^\d$/.test(value)) return

    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError(null)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleResend() {
    if (secondsLeft > 0) return
    setSecondsLeft(RESEND_SECONDS)
    setDigits(['', '', '', '', '', ''])
    setError(null)
    inputRefs.current[0]?.focus()
  }

  async function handleVerify() {
    const code = digits.join('')
    setError(null)
    setIsVerifying(true)

    try {
      verifyOtp(code)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: pendingAccessToken, isVerified: true }),
      })

    //   markVerified()
      router.push('/profile')
    } catch (err) {
      if (err instanceof InvalidOtpError) {
        setError(err.message)
      } else {
        setError('Something went wrong, please try again')
      }
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-lg p-8">
        <h1 className="text-2xl font-medium text-ink mb-1">Verify it&apos;s you</h1>
        <p className="text-sm text-muted mb-7">Enter the 6 digit code we sent</p>

        <div className="flex gap-2 mb-6">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg border border-border-strong rounded-md bg-white text-ink"
            />
          ))}
        </div>

        {error && <p className="text-sm text-danger mb-4">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={isVerifying || digits.some((d) => !d)}
          className="w-full bg-accent text-white font-medium py-2 rounded-md disabled:opacity-60 mb-3"
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>

        <button
          onClick={handleResend}
          disabled={secondsLeft > 0}
          className="w-full text-sm text-muted disabled:opacity-60"
        >
          {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : 'Resend code'}
        </button>
      </div>
    </main>
  )
}