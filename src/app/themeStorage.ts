import type { ThemeName } from '@/styles/theme'

export const THEME_STORAGE_KEY = 'ordacy-theme'

export function getSavedTheme(): ThemeName | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage can be unavailable in private browsing contexts.
  }
  return null
}

export function persistThemeChoice(value: ThemeName) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value)
  } catch {
    // Storage can be unavailable in private browsing contexts.
  }
}

export function getSystemTheme(): ThemeName {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}
