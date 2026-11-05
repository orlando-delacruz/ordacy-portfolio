import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
import { Hero } from './sections/Hero'
import { Pricing } from './sections/Pricing'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
import { SiteFooter } from './sections/SiteFooter'
import { Systems } from './sections/Systems'
import { Testimonials } from './sections/Testimonials'
import { seo } from '@/data'
import { organizationJsonLd, usePageMeta } from '@/hooks/usePageMeta'

const structuredData = organizationJsonLd()

export function HomePage() {
  const { hash } = useLocation()

  usePageMeta({ ...seo.home, structuredData })
  // Section headings, descriptions and content fade up as they scroll into view.
  useScrollReveal()

  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <>
      <Hero />
      <Systems />
      <Pricing />
      <Projects />
      <Testimonials />
      <Process />
      <Faq expandable />
      <FinalCta />
      <SiteFooter />
    </>
  )
}
