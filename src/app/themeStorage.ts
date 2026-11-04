import type { ThemeName } from '@/styles/theme'

export const THEME_STORAGE_KEY = 'ordacy-theme'

export function persistThemeChoice(value: ThemeName) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value)
  } catch {
    // Storage can be unavailable in private browsing contexts.
  }
}

export function getInitialTheme(): ThemeName {
  const attribute = document.documentElement.dataset.theme

  if (attribute === 'light' || attribute === 'dark') return attribute

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage can be unavailable in private browsing contexts.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}
