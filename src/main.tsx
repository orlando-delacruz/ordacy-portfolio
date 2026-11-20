import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppThemeProvider } from '@/app/ThemeProvider'
import { RouteErrorPage } from '@/app/RouteErrorPage'
import { RouteLoading } from '@/app/RouteLoading'
import { loadPublicContent } from '@/data'
import { GlobalStyles } from '@/styles/GlobalStyles'

// The scroll manager takes over from here; stop the browser from restoring
// before React mounts so forward navigations always start clean.
try {
  window.history.scrollRestoration = 'manual'
} catch {
  // Non-browser or locked-down environment: the hook re-applies on mount.
}

const root = createRoot(document.getElementById('root')!)

/**
 * The app mounts only after the content API settles. Each page module reads
 * content at module scope (Home stats and guards, the Projects count), so
 * importing App dynamically is what makes those reads see database values
 * instead of the build-time JSON seed.
 */
async function bootstrap() {
  root.render(
    <AppThemeProvider>
      <GlobalStyles />
      <RouteLoading />
    </AppThemeProvider>,
  )

  try {
    await loadPublicContent()
    const { App } = await import('@/app/App')
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (error) {
    // Any bootstrap failure: content or the app itself could not load, and a
    // first visit has no cached copy to fall back to.
    console.error('Failed to load site content.', error)
    root.render(
      <AppThemeProvider>
        <GlobalStyles />
        <RouteErrorPage standalone />
      </AppThemeProvider>,
    )
  }
}

void bootstrap()
