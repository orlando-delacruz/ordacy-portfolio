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

const PAGE_TITLE =
  'Ordacy | Custom Business Systems, Websites & Digital Solutions'
const PAGE_DESCRIPTION =
  'Ordacy builds custom business systems, websites, dashboards, and digital solutions that help businesses simplify operations and work smarter.'

function setMetaTag(name: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  )

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

export function HomePage() {
  const { hash } = useLocation()

  useEffect(() => {
    const previousTitle = document.title
    const previousDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content')

    document.title = PAGE_TITLE
    setMetaTag('description', PAGE_DESCRIPTION)
    setMetaTag('og:title', PAGE_TITLE)
    setMetaTag('og:description', PAGE_DESCRIPTION)
    setMetaTag('og:type', 'website')

    return () => {
      document.title = previousTitle
      if (previousDescription) {
        setMetaTag('description', previousDescription)
      }
    }
  }, [])

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
