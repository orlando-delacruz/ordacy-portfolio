import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'

// The scroll manager takes over from here; stop the browser from restoring
// before React mounts so forward navigations always start clean.
try {
  window.history.scrollRestoration = 'manual'
} catch {
  // Non-browser or locked-down environment: the hook re-applies on mount.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
