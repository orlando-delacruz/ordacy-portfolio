import { createContext, useContext } from 'react'
import type { ThemeName } from '@/styles/theme'

type ThemeContextValue = {
  theme: ThemeName
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useAppTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider')
  }

  return context
}
