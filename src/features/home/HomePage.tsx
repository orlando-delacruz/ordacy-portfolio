import { PageState } from '@/components/state/PageState'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { faqs, plans, sampleTestimonials, seo, steps, testimonials } from '@/data'
import { organizationJsonLd, usePageMeta } from '@/hooks/usePageMeta'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
import { Hero } from './sections/Hero'
import { Pricing } from './sections/Pricing'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
import { Testimonials } from './sections/Testimonials'
import { HomeSkeleton } from './skeletons/HomeSkeleton'

const structuredData = organizationJsonLd()
const hasTestimonials =
  testimonials.length > 0 || sampleTestimonials.length > 0

export function HomePage() {
  usePageMeta({ ...seo.home, structuredData })
  // Section headings, descriptions and content fade up as they scroll into view.
  // Hash and back-navigation scrolling is owned by usePageScrollRestoration.
  useScrollReveal()

  return (
    <PageState
      page="home"
      hero={<Hero />}
      skeleton={<HomeSkeleton />}
      empty={false}
    >
      {plans.length > 0 && <Pricing />}
      <Projects />
      {hasTestimonials && <Testimonials />}
      {steps.length > 0 && <Process />}
      {faqs.length > 0 && <Faq />}
      <FinalCta />
    </PageState>
  )
}
