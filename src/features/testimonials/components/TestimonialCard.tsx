import { ArrowRight, ChevronUp, Star } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { Testimonial } from '@/data'
import * as S from '../styles/testimonial-card.styled'

type TestimonialCardProps = {
  testimonial: Testimonial
  /** Marquee cards are fixed-width; grid cards fill their cell. */
  layout?: 'marquee' | 'grid'
  hidden?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

// Shared testimonial card: quote, author, optional rating, and a Sample badge
// on illustrative records. Real testimonials never show the badge.
export function TestimonialCard({
  testimonial,
  layout = 'marquee',
  hidden,
  onExpandedChange,
}: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const quoteRef = useRef<HTMLQuoteElement>(null)

  // Detect whether the clamped quote actually overflows, so "Read more" only
  // shows when it's needed (short quotes never get a toggle).
  useLayoutEffect(() => {
    if (expanded) return
    const el = quoteRef.current
    if (!el) return
    setOverflowing(el.scrollHeight > el.clientHeight + 1)
  }, [expanded])

  const toggle = () => {
    const next = !expanded
    setExpanded(next)
    onExpandedChange?.(next)
  }

  const quoteId = `testimonial-${testimonial.id}-quote`
  const ToggleIcon = expanded ? ChevronUp : ArrowRight

  return (
    <S.Card $layout={layout} aria-hidden={hidden || undefined}>
      <S.Top>
        {testimonial.rating !== null ? (
          <S.Rating>
            <S.Stars
              role="img"
              aria-label={`${testimonial.rating} out of 5 stars`}
            >
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  strokeWidth={2}
                  fill="currentColor"
                  aria-hidden="true"
                />
              ))}
            </S.Stars>
            <S.RatingValue>{testimonial.rating}.0</S.RatingValue>
          </S.Rating>
        ) : testimonial.isSample ? (
          <S.SampleBadge>Sample</S.SampleBadge>
        ) : (
          <span aria-hidden="true" />
        )}

        <S.QuoteMark size={32} strokeWidth={2} aria-hidden="true" />
      </S.Top>

      <S.Quotation ref={quoteRef} id={quoteId} $expanded={expanded}>
        {testimonial.quote}
      </S.Quotation>

      {(overflowing || expanded) && (
        <S.ReadMoreButton
          type="button"
          aria-expanded={expanded}
          aria-controls={quoteId}
          tabIndex={hidden ? -1 : 0}
          onClick={toggle}
        >
          {expanded ? 'Read less' : 'Read more'}
          <ToggleIcon size={16} strokeWidth={2} aria-hidden="true" />
        </S.ReadMoreButton>
      )}

      <S.Author>
        <S.Avatar aria-hidden="true">{testimonial.initials}</S.Avatar>
        <S.AuthorInfo>
          <S.AuthorName>{testimonial.name}</S.AuthorName>
          <S.AuthorRole>
            {testimonial.role}
            {' · '}
            {testimonial.company}
          </S.AuthorRole>
        </S.AuthorInfo>
      </S.Author>
    </S.Card>
  )
}
