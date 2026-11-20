import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { PageState } from '@/components/state/PageState'
import { ClosingCta } from '@/components/ui/ClosingCta'
import { Section } from '@/components/ui/Section'
import {
  closingCta,
  pageHeader,
  sectionCopy,
  seo,
  steps,
  testimonials,
} from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Journey } from './components/Journey'
import { TestimonialCard } from './components/TestimonialCard'
import { TestimonialsHero } from './components/TestimonialsHero'
import { TestimonialsSkeleton } from './skeletons/TestimonialsSkeleton'
import * as S from './styles/testimonials-page.styled'

const items = testimonials
const PAGE_SIZE = 4
const header = pageHeader('testimonials')
const cta = closingCta('testimonials', 'cta')

export function TestimonialsPage() {
  usePageMeta(seo.testimonials)
  useScrollReveal()

  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visibleItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  )

  const goToPage = (next: number) => {
    setPage(next)
    document.getElementById('feedback')?.scrollIntoView()
  }

  return (
    <S.Page>
      <PageState
        page="testimonials"
        empty={items.length === 0}
        hero={
          <TestimonialsHero
            eyebrow={header.eyebrow}
            title={header.title}
            description={header.description}
          />
        }
        skeleton={<TestimonialsSkeleton />}
      >
        {items.length > 0 && (
          <Section
            id="feedback"
            {...sectionCopy('testimonials', 'feedback')}
          >
            <S.Grid>
              {visibleItems.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  layout="grid"
                />
              ))}
            </S.Grid>
            {totalPages > 1 && (
              <S.Pagination aria-label="Testimonials pages">
                <S.PageButton
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  aria-disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
                </S.PageButton>
                {pageNumbers.map((number) => (
                  <S.PageButton
                    key={number}
                    type="button"
                    aria-label={`Page ${number}`}
                    aria-current={number === currentPage ? 'page' : undefined}
                    $active={number === currentPage}
                    onClick={() => goToPage(number)}
                  >
                    {number}
                  </S.PageButton>
                ))}
                <S.PageButton
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage === totalPages}
                  aria-disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                </S.PageButton>
              </S.Pagination>
            )}
            <S.SrOnly aria-live="polite">
              Page {currentPage} of {totalPages}
            </S.SrOnly>
          </Section>
        )}

        <Section id="journey" {...sectionCopy('testimonials', 'journey')}>
          <Journey steps={steps} />
        </Section>

        <ClosingCta id="cta" titleId="cta-title" {...cta} />
      </PageState>
    </S.Page>
  )
}
