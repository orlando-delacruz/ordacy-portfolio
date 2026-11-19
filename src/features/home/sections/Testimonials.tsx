import { MessagesSquare, Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { TestimonialCard } from '@/features/testimonials/components/TestimonialCard'
import { sampleTestimonials, testimonials } from '../home.data'
import * as S from './styles/testimonials.styled'
import { ContentItems } from '@/components/ui/ContentItems'
import { getSection, sectionCopy } from '@/data'

// Pixels of marquee travel per second; duration is derived from this so the
// perceived speed stays similar whatever the card count/width.
const PX_PER_SECOND = 40
const ESTIMATED_CARD_WIDTH = 320 // clamp() midpoint, in px

const hasReal = testimonials.length > 0
// Real, approved testimonials when they exist; clearly labeled sample cards
// until then. The trust fallback below covers having neither.
const items = hasReal ? testimonials : sampleTestimonials

const trust = getSection('home', 'trust')

export function Testimonials() {
  if (items.length === 0) {
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
  const duration =
    (items.length * (ESTIMATED_CARD_WIDTH + 24)) / PX_PER_SECOND

  const handleExpandedChange = (expanded: boolean) =>
    setExpandedCount((count) => count + (expanded ? 1 : -1))

  return (
    <Section
      id="testimonials"
      {...(hasReal
        ? sectionCopy('home', 'testimonials')
        : sectionCopy('home', 'testimonial-samples'))}
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
        aria-label={hasReal ? 'Client testimonials, scrolling automatically' : 'Sample testimonials, scrolling automatically'}
      >
        <S.Track
          as="ul"
          $duration={duration}
          $paused={expandedCount > 0 || scrollPaused}
        >
          {[...items, ...items].map((testimonial, index) => {
            const isDuplicate = index >= items.length

            return (
              <TestimonialCard
                key={`${testimonial.id}-${index}`}
                testimonial={testimonial}
                layout="marquee"
                hidden={isDuplicate}
                onExpandedChange={handleExpandedChange}
              />
            )
          })}
        </S.Track>
      </S.Viewport>

      <S.Actions>
        <S.PrimaryButton to="/testimonials">
          <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
          View All Testimonials
        </S.PrimaryButton>
      </S.Actions>
    </Section>
  )
}
