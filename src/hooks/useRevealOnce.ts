import { useEffect, useRef, useState } from 'react'

// True once the element first scrolls into view; stays true. Drives one-shot reveal animations.
export function useRevealOnce<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, revealed] as const
}
