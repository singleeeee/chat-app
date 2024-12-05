import { create } from 'zustand'

interface ThemeStore {
  theme: string
  setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem('chat-app-theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('chat-app-theme', theme)
    set({ theme })
  },
}))
