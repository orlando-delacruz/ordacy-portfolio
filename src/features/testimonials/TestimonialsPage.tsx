import { FolderKanban, MessagesSquare } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { ContentItems } from '@/components/ui/ContentItems'
import { Section } from '@/components/ui/Section'
import { SecondaryButton } from '@/components/ui/styles/buttons.styled'
import { getSection, pageHeader, sectionCopy, seo, steps, testimonials } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import * as S from './styles/testimonials-page.styled'

// `testimonials` holds only approved, published, non-sample entries.
const principles = getSection('testimonials', 'principles')
const journey = steps.map((step) => ({ title: step.title, text: step.description }))

export function TestimonialsPage() {
  usePageMeta(seo.testimonials)
  useScrollReveal()

  return (
    <>
      <PageHeader {...pageHeader('testimonials')} />

      {testimonials.length > 0 && (
        <Section id="feedback" {...sectionCopy('testimonials', 'feedback')}>
          <S.List>
            {testimonials.map((testimonial) => (
              <S.Item key={testimonial.id}>
                <S.Attribution>
                  <strong>{testimonial.name}</strong>
                  <span>
                    {testimonial.role}, {testimonial.company}
                  </span>
                </S.Attribution>
                <S.Quote>{testimonial.quote}</S.Quote>
              </S.Item>
            ))}
          </S.List>
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
