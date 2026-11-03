import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from '@/styles/theme'
import type { ThemeName } from '@/styles/theme'
import { ThemeContext } from './theme-context'
import { ThemeTransitionOverlay } from './ThemeTransition'

const STORAGE_KEY = 'ordacy-theme'

function getInitialTheme(): ThemeName {
  const attribute = document.documentElement.dataset.theme

  if (attribute === 'light' || attribute === 'dark') return attribute

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage can be unavailable in private browsing contexts.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme)
  const [transitionTo, setTransitionTo] = useState<ThemeName | null>(null)
  const transitioningRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const toggleTheme = useCallback(() => {
    if (transitioningRef.current) return

    const to: ThemeName = theme === 'light' ? 'dark' : 'light'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(to)
      return
    }

    transitioningRef.current = true
    setTransitionTo(to)
    // Commit the theme behind the opaque overlay, then remove the overlay.
    // Timer-driven so the theme can never get stuck if a frame is dropped.
    timersRef.current.push(window.setTimeout(() => setTheme(to), 420))
    timersRef.current.push(
      window.setTimeout(() => {
        setTransitionTo(null)
        transitioningRef.current = false
      }, 980),
    )
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Persistence is best-effort.
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        theme === 'dark'
          ? darkTheme.colors.background.default
          : lightTheme.colors.background.default,
      )
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        {children}
        {transitionTo && <ThemeTransitionOverlay to={transitionTo} />}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}
