'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCartStore } from '@/presentation/store/cartStore'
import { useAuthStore } from '@/presentation/store/authStore'

const links = [
  { href: '/profile', label: 'Profile' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const logout = useAuthStore((state) => state.logout)

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  async function handleLogout() {
    await fetch('/api/session', { method: 'DELETE' })
    logout()
    router.push('/login')
  }

  return (
    <nav className="w-full bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/products" aria-label="Go to products">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm relative ${isActive ? 'text-accent font-medium' : 'text-muted'}`}
              >
                {link.label}
                {link.href === '/cart' && cartCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center bg-accent text-white text-[11px] rounded-full w-5 h-5">
                    {cartCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        <button onClick={handleLogout} className="text-sm text-danger">
          Log out
        </button>
      </div>
    </nav>
  )
}