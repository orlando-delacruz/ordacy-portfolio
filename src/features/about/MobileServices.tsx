import { useEffect, useRef } from 'react'
import { services } from '@/data'
import * as S from './styles/mobile-services.styled'

type MobileServicesProps = {
  activeId: string
  onSelect: (id: string) => void
}

// The card counts as centred within this many pixels, matching the snap slack.
const CENTER_TOLERANCE = 8

// Fallback for browsers without a reliable `scrollend` after a smooth scroll.
const SCROLL_END_FALLBACK = 700

/** The index of the card whose centre is closest to the track's centre. */
function nearestIndex(track: HTMLElement, cards: Array<HTMLElement | null>) {
  const trackRect = track.getBoundingClientRect()
  const centre = trackRect.left + trackRect.width / 2
  let nearest = 0
  let closest = Number.POSITIVE_INFINITY

  cards.forEach((card, index) => {
    if (!card) return
    const rect = card.getBoundingClientRect()
    const distance = Math.abs(rect.left + rect.width / 2 - centre)
    if (distance < closest) {
      closest = distance
      nearest = index
    }
  })

  return nearest
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Swipeable, snap-per-card service list for small screens. Controlled by the
 * same active service as the desktop ServiceExplorer, so both stay in sync.
 */
export function MobileServices({ activeId, onSelect }: MobileServicesProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const lastIndex = useRef(services.findIndex((service) => service.id === activeId))
  const fromScroll = useRef(false)
  const suppressSync = useRef(false)
  const mounted = useRef(false)

  // A change from outside the track (dot, link, parent state) centres the card.
  // Changes that came from a swipe are already where the reader put them.
  useEffect(() => {
    const index = services.findIndex((service) => service.id === activeId)
    const track = trackRef.current
    const card = cardRefs.current[index]
    const scrolled = fromScroll.current
    fromScroll.current = false

    if (scrolled || index < 0 || !track || !card) return

    lastIndex.current = index

    const trackRect = track.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const offset =
      cardRect.left + cardRect.width / 2 - (trackRect.left + trackRect.width / 2)

    if (Math.abs(offset) <= CENTER_TOLERANCE) {
      mounted.current = true
      return
    }

    // Mount lands instantly; later outside changes glide.
    const behavior: ScrollBehavior =
      mounted.current && !prefersReducedMotion() ? 'smooth' : 'auto'
    mounted.current = true

    if (behavior === 'auto') {
      track.scrollTo({ left: track.scrollLeft + offset, behavior })
      return
    }

    // A smooth jump crosses other cards. Ignore the scroll events it fires so
    // the dots don't flicker and the target isn't overridden mid-flight.
    suppressSync.current = true
    track.scrollTo({ left: track.scrollLeft + offset, behavior })

    let timer = 0
    const release = () => {
      window.clearTimeout(timer)
      track.removeEventListener('scrollend', release)
      track.removeEventListener('pointerdown', release)
      suppressSync.current = false
    }

    track.addEventListener('scrollend', release, { once: true })
    // A swipe that interrupts the glide takes over immediately.
    track.addEventListener('pointerdown', release, { once: true })
    timer = window.setTimeout(release, SCROLL_END_FALLBACK)

    return () => {
      window.clearTimeout(timer)
      track.removeEventListener('scrollend', release)
      track.removeEventListener('pointerdown', release)
      suppressSync.current = false
    }
  }, [activeId])

  // Report the card nearest the centre, at most once per frame and only when
  // the index actually changes.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const sync = () => {
      frame = 0
      if (suppressSync.current) return

      const index = nearestIndex(track, cardRefs.current)
      const service = services[index]
      if (!service || index === lastIndex.current) return

      lastIndex.current = index
      fromScroll.current = true
      onSelect(service.id)
    }

    const handleScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(sync)
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', handleScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [onSelect])

  return (
    <S.Carousel
      role="region"
      aria-label="Services"
      aria-roledescription="carousel"
    >
      <S.Track ref={trackRef}>
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <S.Card
              key={service.id}
              aria-label={service.title}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
            >
              <S.Copy>
                <S.IconTile aria-hidden="true">
                  <Icon size={20} strokeWidth={2} />
                </S.IconTile>
                <S.Title>{service.title}</S.Title>
                <S.Description>{service.description}</S.Description>
              </S.Copy>
              <S.Visual aria-hidden="true" />
            </S.Card>
          )
        })}
      </S.Track>

      <S.Dots>
        {services.map((service) => {
          const active = service.id === activeId
          return (
            <S.Dot
              key={service.id}
              type="button"
              aria-label={`Show ${service.title}`}
              aria-current={active ? 'true' : undefined}
              onClick={() => onSelect(service.id)}
            >
              <span aria-hidden="true" />
            </S.Dot>
          )
        })}
      </S.Dots>
    </S.Carousel>
  )
}
