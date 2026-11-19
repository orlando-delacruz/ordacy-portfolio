import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
import { Hero } from './sections/Hero'
import { Pricing } from './sections/Pricing'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
import { Testimonials } from './sections/Testimonials'
import { seo } from '@/data'
import { organizationJsonLd, usePageMeta } from '@/hooks/usePageMeta'

const structuredData = organizationJsonLd()

export function HomePage() {
  usePageMeta({ ...seo.home, structuredData })
  // Section headings, descriptions and content fade up as they scroll into view.
  // Hash and back-navigation scrolling is owned by usePageScrollRestoration.
  useScrollReveal()

  return (
    <>
      <Hero />
      <Pricing />
      <Projects />
      <Testimonials />
      <Process />
      <Faq />
      <FinalCta />
    </>
  )
}
