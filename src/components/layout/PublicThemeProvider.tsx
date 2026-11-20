import type { ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { useAppTheme } from '@/app/theme-context'
import { fluidDarkTheme, fluidLightTheme } from '@/styles/theme'

type PublicThemeProviderProps = {
  children: ReactNode
}

/**
 * The fluid public type scale for everything that renders outside RootLayout:
 * public pages, and the standalone route loading and error screens.
 */
export function PublicThemeProvider({ children }: PublicThemeProviderProps) {
  const { theme } = useAppTheme()

  return (
    <StyledThemeProvider
      theme={theme === 'dark' ? fluidDarkTheme : fluidLightTheme}
    >
      {children}
    </StyledThemeProvider>
  )
}
