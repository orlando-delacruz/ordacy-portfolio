import { useEffect } from 'react'

/**
 * Marks every [data-reveal] element on the page with data-revealed the first
 * time it scrolls into view. The fade-up itself lives in GlobalStyles.
 * Call once from a page component; it scans the elements present on mount.
 * Pass a key (e.g. a layout flag) to re-scan after the rendered branch changes.
 */
export function useScrollReveal(revealKey: unknown = 0) {
  useEffect(() => {
    // Referenced so the effect re-runs when the branch changes.
    void revealKey
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        }
      },
      // Trigger a little before the element is fully on screen.
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )

    document
      .querySelectorAll('[data-reveal]:not([data-revealed])')
      .forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [revealKey])
}
