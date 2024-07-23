import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  setIsLoggedIn: (loggedIn: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (loggedIn) => set(() => ({ isLoggedIn: loggedIn })),
}))
