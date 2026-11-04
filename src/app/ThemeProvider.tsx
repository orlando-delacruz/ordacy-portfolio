import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from '@/styles/theme'
import type { ThemeName } from '@/styles/theme'
import { ThemeContext } from './theme-context'
import { ThemeTransitionOverlay } from './ThemeTransition'
import {
  getInitialTheme,
  persistThemeChoice,
  THEME_STORAGE_KEY,
} from './themeStorage'

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
    persistThemeChoice(to)

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

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        theme === 'dark'
          ? darkTheme.colors.background.default
          : lightTheme.colors.background.default,
      )
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    // Follow the OS theme live, but only until the user makes a manual
    // choice (a saved preference takes priority over system changes).
    const handleChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY) === null) {
          setTheme(event.matches ? 'dark' : 'light')
        }
      } catch {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

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
