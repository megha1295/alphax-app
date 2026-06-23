import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/domain/entities/Product'
import { CartItem } from '@/domain/entities/CartItem'

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  decreaseQuantity: (id: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            }
          }

          return { items: [...state.items, { ...product, quantity: 1 }] }
        }),

      decreaseQuantity: (id) =>
        set((state) => {
          const updated = state.items
            .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0)

          return { items: updated }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'alphax-cart' }
  )
)