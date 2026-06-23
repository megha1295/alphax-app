'use client'

import Image from 'next/image'
import Navbar from '@/presentation/components/Navbar'
import { useCartStore } from '@/presentation/store/cartStore'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background px-6 py-8">
          <div className="max-w-xl mx-auto text-center py-16">
            <p className="text-sm text-muted">Your cart is empty</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-6 py-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-xl font-medium text-ink mb-5">Your cart</h1>

          <div className="bg-surface border border-border rounded-lg divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div className="relative w-12 h-12 bg-background rounded-md overflow-hidden flex-shrink-0">
                  <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                  <p className="text-xs text-muted">${item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-7 h-7 border border-border-strong rounded-md text-ink"
                  >
                    -
                  </button>
                  <span className="text-sm text-ink w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => addItem(item)}
                    className="w-7 h-7 border border-border-strong rounded-md text-ink"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm text-ink w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted text-sm ml-1"
                  aria-label={`Remove ${item.title}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-5 mb-5">
            <span className="text-base font-medium text-ink">Total</span>
            <span className="text-base font-medium text-ink">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={clearCart}
            className="w-full border border-border-strong text-ink font-medium py-2 rounded-md"
          >
            Clear cart
          </button>
        </div>
      </main>
    </>
  )
}