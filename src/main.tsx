import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppThemeProvider } from '@/app/ThemeProvider'
import { RouteErrorPage } from '@/app/RouteErrorPage'
import { RouteLoading } from '@/app/RouteLoading'
import { loadPublicContent } from '@/data'
import { drainInquiryDrafts } from '@/services/inquiries'
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
 * The admin bundle must load even when the public content API is down: the
 * admin reads its data through its own authenticated services, and blocking on
 * `loadPublicContent()` would make sign-in impossible during an outage. Public
 * pages keep the seed until the live payload arrives.
 */
async function bootstrap() {
  root.render(
    <AppThemeProvider>
      <GlobalStyles />
      <RouteLoading />
    </AppThemeProvider>,
  )

  try {
    if (!window.location.pathname.startsWith('/admin')) {
      // One-time delivery of pre-phase-04 browser drafts. Never blocks or
      // fails the page: failures stay in localStorage for the next load.
      void drainInquiryDrafts()
      await loadPublicContent()
    }
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
