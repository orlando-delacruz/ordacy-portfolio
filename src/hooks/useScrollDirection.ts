import { useCallback, useEffect, useRef, useState } from 'react'

const SCROLL_THRESHOLD = 8
const TOP_OFFSET = 24

export function useScrollDirection() {
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const frame = useRef<number | null>(null)

  const reveal = useCallback(() => setHidden(false), [])

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const update = () => {
      frame.current = null
      const scrollY = Math.max(window.scrollY, 0)
      const delta = scrollY - lastScrollY.current

      if (Math.abs(delta) < SCROLL_THRESHOLD) return

      lastScrollY.current = scrollY

      if (scrollY <= TOP_OFFSET) {
        setHidden(false)
        return
      }

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
