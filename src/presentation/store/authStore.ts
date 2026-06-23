import { create } from 'zustand'
import { User } from '@/domain/entities/User'

interface AuthState {
  user: User | null
  pendingAccessToken: string | null
  setPendingAccessToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  pendingAccessToken: null,

  setPendingAccessToken: (token) => set({ pendingAccessToken: token }),


  setUser: (user) => set({ user }),

  logout: () => set({ user: null, pendingAccessToken: null }),
}))