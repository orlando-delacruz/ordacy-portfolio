import { MessagesSquare, Pause, Play, Star } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Section } from '@/components/ui/Section'
import { testimonials } from '../home.data'
import type { Testimonial } from '../home.data'
import * as S from './styles/testimonials.styled'
import { ContentItems } from '@/components/ui/ContentItems'
import { getSection, sectionCopy } from '@/data'

// Pixels of marquee travel per second; duration is derived from this so the
// perceived speed stays similar whatever the card count/width.
const PX_PER_SECOND = 40
const ESTIMATED_CARD_WIDTH = 320 // clamp() midpoint, in px
const duration =
  (testimonials.length * (ESTIMATED_CARD_WIDTH + 24)) / PX_PER_SECOND

type TestimonialCardProps = {
  testimonial: Testimonial
  hidden?: boolean
  onExpandedChange: (expanded: boolean) => void
}

function TestimonialCard({
  testimonial,
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
    onExpandedChange(next)
  }

  const quoteId = `testimonial-${testimonial.id}-quote`

  return (
    <S.Card aria-hidden={hidden || undefined}>
      <S.QuoteMark size={40} strokeWidth={2} aria-hidden="true" />

      {testimonial.rating !== null && (
        <S.Stars role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
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
      )}

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

const trust = getSection('home', 'trust')

// Only approved, genuine testimonials are published. Until there are some,
// the section explains how Ordacy works with clients instead.
export function Testimonials() {
  if (testimonials.length === 0) {
    return (
      <Section id="testimonials" {...sectionCopy('home', 'trust')}>
        <ContentItems items={trust.items} variant="numbered" />
        <S.Actions>
          <S.SecondaryButton to="/testimonials">
            <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
            How we work with clients
          </S.SecondaryButton>
        </S.Actions>
      </Section>
    )
  }

  return <TestimonialsMarquee />
}

function TestimonialsMarquee() {
  // Tracks how many cards are currently expanded; pause the marquee while any
  // are, so an expanded quote doesn't scroll away mid-read.
  const [expandedCount, setExpandedCount] = useState(0)
  const [scrollPaused, setScrollPaused] = useState(false)

  const handleExpandedChange = (expanded: boolean) =>
    setExpandedCount((count) => count + (expanded ? 1 : -1))

  return (
    <Section
      id="testimonials"
      {...sectionCopy('home', 'testimonials')}
      headerAction={
        <S.ScrollToggle
          type="button"
          aria-pressed={scrollPaused}
          aria-label={
            scrollPaused
              ? 'Resume testimonial scrolling'
              : 'Pause testimonial scrolling'
          }
          onClick={() => setScrollPaused((paused) => !paused)}
        >
          {scrollPaused ? (
            <Play size={18} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Pause size={18} strokeWidth={2} aria-hidden="true" />
          )}
        </S.ScrollToggle>
      }
    >
      <S.Viewport
        role="region"
        aria-label="Client testimonials, scrolling automatically"
      >
        <S.Track
          as="ul"
          $duration={duration}
          $paused={expandedCount > 0 || scrollPaused}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => {
            const isDuplicate = index >= testimonials.length

            return (
              <TestimonialCard
                key={`${testimonial.id}-${index}`}
                testimonial={testimonial}
                hidden={isDuplicate}
                onExpandedChange={handleExpandedChange}
              />
            )
          })}
        </S.Track>
      </S.Viewport>

      <S.Actions>
        <S.SecondaryButton to="/testimonials">
          <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
          View All Testimonials
        </S.SecondaryButton>
      </S.Actions>
    </Section>
  )
}
