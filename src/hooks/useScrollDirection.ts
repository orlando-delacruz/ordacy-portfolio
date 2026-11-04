import { useCallback, useEffect, useRef, useState } from 'react'

const SCROLL_THRESHOLD = 8
const TOP_OFFSET = 24
// Within this distance of the page end the nav stays visible.
const BOTTOM_OFFSET = 24

export function useScrollDirection() {
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const frame = useRef<number | null>(null)

  const reveal = useCallback(() => setHidden(false), [])

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const update = () => {
      frame.current = null
      // Clamp to the real scroll range so overscroll bounce (iOS rubber-banding
      // past the top or bottom) never reads as a direction change.
      const maxScrollY = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      )
      const scrollY = Math.min(Math.max(window.scrollY, 0), maxScrollY)

      // At the very top or bottom of the page the nav is always shown, however
      // much further the user swipes.
      if (scrollY <= TOP_OFFSET || scrollY >= maxScrollY - BOTTOM_OFFSET) {
        lastScrollY.current = scrollY
        setHidden(false)
        return
      }

      const delta = scrollY - lastScrollY.current

      if (Math.abs(delta) < SCROLL_THRESHOLD) return

      lastScrollY.current = scrollY

      setHidden(delta > 0)
    }

    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    }
  }, [])

  return { hidden, reveal }
}
