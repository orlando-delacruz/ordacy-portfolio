import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Page scroll contract:
// - PUSH/REPLACE without a hash: the new page starts at the top.
// - PUSH/REPLACE with a hash (e.g. /#team): jump to that element.
// - POP (browser back/forward): restore the exact saved position, falling
//   back to the hash element and then the top when nothing was saved.
// - #more is mobile-menu UI state, never an anchor target: ignore it.
//
// Mount once per active shell (RootLayout, AdminLayout). Do not render
// React Router's <ScrollRestoration /> alongside this; they would compete.

const STORAGE_KEY = 'ordacy-scroll:v1'
const MAX_ENTRIES = 50
const RETRY_MS = 1500

// Positions for this tab, hydrated from session storage on first use.
const positions = new Map<string, number>()
let hydrated = false

function loadStored(): void {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'number') positions.set(key, value)
      }
    }
  } catch {
    // Private mode or corrupt data: start fresh in memory.
  }
}

function persist(): void {
  try {
    while (positions.size > MAX_ENTRIES) {
      const oldest = positions.keys().next()
      if (oldest.done) break
      positions.delete(oldest.value)
    }
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(positions)),
    )
  } catch {
    // Storage unavailable: keep positions in memory for this visit.
  }
}

function save(key: string): void {
  positions.set(key, window.scrollY)
  persist()
}

/**
 * Persist the leaving entry's position, but never lower it: async pages
 * render a short loading state first, which collapses the document and makes
 * the browser clamp scrollY. The rAF-tracked value from before the collapse
 * is the trustworthy one.
 */
function retain(key: string): void {
  const stored = positions.get(key)
  const y = typeof stored === 'number' ? Math.max(window.scrollY, stored) : window.scrollY
  positions.set(key, y)
  persist()
}

/** Anchor target for a hash, or null for #more and unknown ids. */
function scrollTarget(hash: string): HTMLElement | null {
  if (!hash || hash === '#more') return null
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)))
  } catch {
    return null
  }
}

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SCROLL_KEYS = [
  'ArrowDown',
  'ArrowUp',
  'PageDown',
  'PageUp',
  'Home',
  'End',
  ' ',
]

// Async pages (admin collections) render loading states first, so the
// document may be too short when restoration runs. Retry until it is tall
// enough or the window expires. Returns a cleanup that stops the retry.
function restoreExact(y: number): () => void {
  let raf = 0
  const started = performance.now()
  const detach = () => {
    window.cancelAnimationFrame(raf)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchmove', onTouch)
    window.removeEventListener('keydown', onKey)
  }
  // Never fight the user: any manual scroll input ends the retry.
  const onWheel = () => detach()
  const onTouch = () => detach()
  const onKey = (event: KeyboardEvent) => {
    if (SCROLL_KEYS.includes(event.key)) detach()
  }
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  window.addEventListener('keydown', onKey)

  const step = () => {
    window.scrollTo(0, y)
    // Done only when the target itself is reached. If the document is still
    // shorter than the target (async content still loading), keep retrying
    // until the window expires instead of settling for the clamped maximum.
    if (
      window.scrollY >= y - 1 ||
      performance.now() - started > RETRY_MS
    ) {
      detach()
      return
    }
    raf = window.requestAnimationFrame(step)
  }
  step()
  return detach
}

export function usePageScrollRestoration(): void {
  const location = useLocation()
  const navigationType = useNavigationType()
  const keyRef = useRef(location.key)
  const prevRef = useRef(location)
  const mountedRef = useRef(false)
  const retryCleanup = useRef<(() => void) | null>(null)
  const saveRaf = useRef(0)

  // Track the live position of the current history entry.
  useEffect(() => {
    if (!hydrated) {
      hydrated = true
      loadStored()
    }
    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      saveRaf.current = window.requestAnimationFrame(() => {
        queued = false
        save(keyRef.current)
      })
    }
    const onPageHide = () => save(keyRef.current)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', onPageHide)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', onPageHide)
      window.cancelAnimationFrame(saveRaf.current)
    }
  }, [])

  // React to navigation.
  useEffect(() => {
    if (mountedRef.current) {
      // Persist the position of the entry being left (see retain).
      retain(keyRef.current)
    } else {
      // Fresh mount: the page just loaded, so there is nothing to persist.
      // Skipping the save keeps a reload's stored position intact for the
      // POP branch below to restore.
      mountedRef.current = true
    }
    keyRef.current = location.key

    const prev = prevRef.current
    prevRef.current = location

    retryCleanup.current?.()
    retryCleanup.current = null

    // Opening or closing the mobile More menu must never move the page.
    if (location.hash === '#more') return
    if (
      prev.hash === '#more' &&
      prev.pathname === location.pathname &&
      !location.hash
    ) {
      return
    }

    if (navigationType === 'POP') {
      const saved = positions.get(location.key)
      if (typeof saved === 'number') {
        retryCleanup.current = restoreExact(saved)
        return
      }
      const target = scrollTarget(location.hash)
      if (target) {
        target.scrollIntoView({ block: 'start', behavior: 'auto' })
        return
      }
      window.scrollTo(0, 0)
      return
    }

    // PUSH or REPLACE: fresh entries start at the top.
    const target = scrollTarget(location.hash)
    if (target) {
      const samePage = prev.pathname === location.pathname
      target.scrollIntoView({
        block: 'start',
        behavior: samePage && !reduceMotion() ? 'smooth' : 'auto',
      })
      return
    }
    window.scrollTo(0, 0)
  }, [location, navigationType])
}
