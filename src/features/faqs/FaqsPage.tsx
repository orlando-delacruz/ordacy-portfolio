import { CircleHelp, MessagesSquare, Tag } from 'lucide-react'
import { PageState } from '@/components/state/PageState'
import { ClosingCta } from '@/components/ui/ClosingCta'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import * as Hero from '@/components/ui/styles/page-hero.styled'
import {
  closingCta,
  faqs,
  pageHeader,
  sectionCopy,
  seo,
} from '@/data'
import { FaqBrowser } from './FaqBrowser'
import { FaqsSkeleton } from './skeletons/FaqsSkeleton'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const header = pageHeader('faqs')

export function FaqsPage() {
  usePageMeta(seo.faqs)
  useScrollReveal()

  return (
    <PageState
      page="faqs"
      empty={faqs.length === 0}
      hero={
        <PageHero
          titleId="faqs-title"
          eyebrow={header.eyebrow}
          badgeIcon={CircleHelp}
          title={header.title}
          description={header.description}
          actions={
            <>
              <Hero.PrimaryButton to="/contact">
                <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
                Contact us
              </Hero.PrimaryButton>
              <Hero.GhostButton to="/pricing">
                <Tag size={18} strokeWidth={2} aria-hidden="true" />
                View pricing
              </Hero.GhostButton>
            </>
          }
        />
      }
      skeleton={<FaqsSkeleton />}
    >
      <Section id="questions" {...sectionCopy('faqs', 'questions')}>
        <FaqBrowser />
      </Section>

      <ClosingCta
        id="cta"
        titleId="faqs-cta-title"
        {...closingCta('faqs', 'cta')}
      />
    </PageState>
  )
}
