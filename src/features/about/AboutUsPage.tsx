import { Info, Layers, Rocket } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from 'styled-components'
import { ClosingCta } from '@/components/ui/ClosingCta'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHead } from '@/components/ui/SectionHead'
import * as Hero from '@/components/ui/styles/page-hero.styled'
import { closingCta, getSection, pageHeader, seo, services, steps } from '@/data'
import type { PageSectionRecord } from '@/data'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { AddressExplorer } from './AddressExplorer'
import { MobileServices } from './MobileServices'
import { MobileSystems } from './MobileSystems'
import { ServiceExplorer } from './ServiceExplorer'
import {
  Audience,
  Expectations,
  Principles,
  ProcessPath,
} from './about-sections'
import * as S from './styles/about.styled'

const header = pageHeader('about')
const purpose = getSection('about', 'what-we-do')
const address = getSection('about', 'services')
const build = getSection('about', 'offerings')
const approach = getSection('about', 'approach')
const process = getSection('about', 'how-we-work')
const who = getSection('about', 'who-we-help')
const expectations = getSection('about', 'expectations')
const closing = closingCta('about', 'work-with-us')

// The H1's second line renders in teal; everything before it stays white.
const ACCENT_PHRASE = 'Grow Further.'

// Two paragraphs are stored in one description, separated by a blank line.
const purposeParagraphs = (purpose.description ?? '')
  .split('\n\n')
  .filter(Boolean)

type SectionText = {
  title: string
  description: string
}

/** Desktop keeps the stored copy; mobile uses its optional variants. */
function sectionText(
  section: PageSectionRecord,
  isDesktop: boolean,
): SectionText {
  if (isDesktop) {
    return {
      title: section.title,
      description: section.description ?? '',
    }
  }
  return {
    title: section.mobile?.title ?? section.title,
    description: section.mobile?.description ?? section.description ?? '',
  }
}

export function AboutUsPage() {
  usePageMeta(seo.about)
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`)
  useScrollReveal(isDesktop)

  const [serviceId, setServiceId] = useState(services[0]?.id ?? '')

  // "How Ordacy helps" links pick the service and move the reader to it.
  const openService = (id: string) => {
    setServiceId(id)
    document
      .getElementById('services')
      ?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' })
    const desktopTab = document.getElementById(`service-tab-${id}`)
    if (desktopTab) {
      desktopTab.focus({ preventScroll: true })
      return
    }
    // Mobile has no service tabs; move focus to the section heading instead.
    document.getElementById('services-title')?.focus({ preventScroll: true })
  }

  const purposeText = sectionText(purpose, isDesktop)
  const buildText = sectionText(build, isDesktop)
  const approachText = sectionText(approach, isDesktop)
  const processText = sectionText(process, isDesktop)
  const whoText = sectionText(who, isDesktop)
  const expectationsText = sectionText(expectations, isDesktop)

  return (
    <S.Page>
      <PageHero
        titleId="about-title"
        eyebrow={header.eyebrow}
        badgeIcon={Info}
        title={header.title}
        accent={ACCENT_PHRASE}
        description={header.description}
        actions={
          <>
            <Hero.PrimaryButton to="/contact">
              <Rocket size={18} strokeWidth={2} aria-hidden="true" />
              Get started
            </Hero.PrimaryButton>
            <Hero.GhostButton to="/about-us#services">
              <Layers size={18} strokeWidth={2} aria-hidden="true" />
              View services
            </Hero.GhostButton>
          </>
        }
      />

      <S.Block id="what-we-do" aria-labelledby="what-we-do-title">
        <SectionHead
          id="what-we-do"
          title={purposeText.title}
          description={
            isDesktop ? purposeParagraphs[0] : purposeText.description
          }
        />
        {isDesktop ? (
          purposeParagraphs.length > 1 && (
            <S.WhyCopy data-reveal="1">
              {purposeParagraphs.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </S.WhyCopy>
          )
        ) : (
          <div data-reveal="1">
            <MobileSystems onSelectService={openService} />
          </div>
        )}
      </S.Block>

      {isDesktop && (
        <S.Block id="what-we-address" aria-labelledby="what-we-address-title">
          <SectionHead
            id="what-we-address"
            title={address.title}
            description={address.description ?? undefined}
          />
          <div data-reveal="1">
            <AddressExplorer onSelectService={openService} />
          </div>
        </S.Block>
      )}

      {/* `services` is the id Home and Projects link to. */}
      <S.Block id="services" aria-labelledby="services-title">
        <SectionHead
          id="services"
          title={isDesktop ? build.title : buildText.title}
          description={
            (isDesktop ? build.description : buildText.description) ??
            undefined
          }
        />
        <div data-reveal="1">
          {isDesktop ? (
            <ServiceExplorer activeId={serviceId} onSelect={setServiceId} />
          ) : (
            <MobileServices activeId={serviceId} onSelect={setServiceId} />
          )}
        </div>
      </S.Block>

      <S.Block id="approach" aria-labelledby="approach-title">
        <SectionHead
          id="approach"
          title={isDesktop ? approach.title : approachText.title}
          description={
            (isDesktop ? approach.description : approachText.description) ??
            undefined
          }
        />
        <div data-reveal="1">
          <Principles items={approach.items ?? []} />
        </div>
      </S.Block>

      <S.Block id="how-we-work" aria-labelledby="how-we-work-title">
        <SectionHead
          id="how-we-work"
          title={isDesktop ? process.title : processText.title}
          description={
            (isDesktop ? process.description : processText.description) ??
            undefined
          }
        />
        <div data-reveal="1">
          <ProcessPath steps={steps} />
        </div>
      </S.Block>

      <S.Block id="who-we-help" aria-labelledby="who-we-help-title">
        <SectionHead
          id="who-we-help"
          title={isDesktop ? who.title : whoText.title}
          description={
            (isDesktop ? who.description : whoText.description) ?? undefined
          }
        />
        <div data-reveal="1">
          <Audience items={who.items ?? []} />
        </div>
      </S.Block>

      <S.Block id="expectations" aria-labelledby="expectations-title">
        <SectionHead
          id="expectations"
          title={isDesktop ? expectations.title : expectationsText.title}
          description={
            (isDesktop
              ? expectations.description
              : expectationsText.description) ?? undefined
          }
        />
        <div data-reveal="1">
          <Expectations items={expectations.items ?? []} />
        </div>
      </S.Block>

      <ClosingCta
        id="work-with-us"
        titleId="work-with-us-title"
        {...closing}
      />
    </S.Page>
  )
}

/** Smooth scrolling only when the visitor allows motion. */
function reduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
