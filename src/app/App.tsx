import { RouterProvider } from 'react-router-dom'
import { GlobalStyles } from '@/styles/GlobalStyles'
import { AppThemeProvider } from './ThemeProvider'
import { router } from './router'

export function App() {
  return (
    <AppThemeProvider>
      <GlobalStyles />
      <RouterProvider router={router} />
    </AppThemeProvider>
  )
}
