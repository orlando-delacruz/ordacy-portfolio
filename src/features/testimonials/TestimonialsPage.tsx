import { FolderKanban, MessagesSquare } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { ContentItems } from '@/components/ui/ContentItems'
import { Section } from '@/components/ui/Section'
import { SecondaryButton } from '@/components/ui/styles/buttons.styled'
import { getSection, pageHeader, sampleTestimonials, sectionCopy, seo, steps, testimonials } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { TestimonialCard } from './components/TestimonialCard'
import * as S from './styles/testimonials-page.styled'

// Real, approved testimonials when they exist; clearly labeled sample cards
// until then. The principles below always describe how we work.
const hasReal = testimonials.length > 0
const items = hasReal ? testimonials : sampleTestimonials
const principles = getSection('testimonials', 'principles')
const journey = steps.map((step) => ({ title: step.title, text: step.description }))

export function TestimonialsPage() {
  usePageMeta(seo.testimonials)
  useScrollReveal()

  return (
    <>
      <PageHeader {...pageHeader('testimonials')} />

      {items.length > 0 && (
        <Section
          id="feedback"
          {...(hasReal
            ? sectionCopy('testimonials', 'feedback')
            : sectionCopy('testimonials', 'samples'))}
        >
          <S.Grid>
            {items.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                layout="grid"
              />
            ))}
          </S.Grid>
        </Section>
      )}

      <Section id="principles" {...sectionCopy('testimonials', 'principles')}>
        <ContentItems items={principles.items} variant="numbered" />
      </Section>

      <Section id="journey" {...sectionCopy('testimonials', 'journey')}>
        <ContentItems items={journey} variant="ruled" />
      </Section>

      <Section id="cta" {...sectionCopy('testimonials', 'cta')}>
        <S.Actions>
          <S.PrimaryButton to="/contact">
            <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
            Start a conversation
          </S.PrimaryButton>
          <SecondaryButton to="/projects">
            <FolderKanban size={18} strokeWidth={2} aria-hidden="true" />
            See concept projects
          </SecondaryButton>
        </S.Actions>
      </Section>
    </>
  )
}
