import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
import { Hero } from './sections/Hero'
import { Pricing } from './sections/Pricing'
import { Problems } from './sections/Problems'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
import { Services } from './sections/Services'
import { SiteFooter } from './sections/SiteFooter'
import { Testimonials } from './sections/Testimonials'
import { useHomePageMeta } from './useHomePageMeta'

export function HomePage() {
  const { hash } = useLocation()

  useHomePageMeta()

  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <>
      <Hero />
      <Problems />
      <Services />
      <Pricing />
      <Projects />
      <Testimonials />
      <Process />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </>
  )
}
