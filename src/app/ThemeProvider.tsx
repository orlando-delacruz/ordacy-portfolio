import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from '@/styles/theme'
import type { ThemeName } from '@/styles/theme'
import { ThemeContext } from './theme-context'
import { ThemeTransitionOverlay } from './ThemeTransition'
import {
  getSavedTheme,
  getSystemTheme,
  persistThemeChoice,
} from './themeStorage'

// Theme = saved manual choice, else the OS theme (followed live while no
// manual choice exists). index.html applies the same rule before hydration.
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(
    () => getSavedTheme() ?? getSystemTheme(),
  )
  const [transitionTo, setTransitionTo] = useState<ThemeName | null>(null)
  const transitioningRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (!getSavedTheme()) setTheme(query.matches ? 'dark' : 'light')
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

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
