import { useState } from 'react'
import { ClosingCta } from '@/components/ui/ClosingCta'
import { Section } from '@/components/ui/Section'
import { closingCta, faqs, sectionCopy, seo } from '@/data'
import { Faq } from '@/features/home/sections/Faq'
import type { Currency } from '@/features/home/home.data'
import {
  PlanCurrencyToggle,
  PricingPlans,
} from '@/features/home/sections/Pricing'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { CompareTable } from './components/CompareTable'
import { HowItWorks } from './components/HowItWorks'
import { PricingHero } from './components/PricingHero'

const pricingFaqs = faqs
  .filter((faq) => faq.pricingPage)
  .slice(0, 5)
const cta = closingCta('pricing', 'cta')

export function PricingPage() {
  usePageMeta(seo.pricing)
  useScrollReveal()

  const [currency, setCurrency] = useState<Currency>('PHP')

  return (
    <>
      <PricingHero />

      <Section
        id="plans"
        {...sectionCopy('pricing', 'plans')}
        headerAction={
          <PlanCurrencyToggle
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        }
      >
        <PricingPlans
          currency={currency}
          onCurrencyChange={setCurrency}
          showToggle={false}
        />
      </Section>

      <Section id="compare" {...sectionCopy('pricing', 'compare')}>
        <CompareTable />
      </Section>

      <Section
        id="how-pricing-works"
        {...sectionCopy('pricing', 'how-pricing-works')}
      >
        <HowItWorks />
      </Section>

      <Faq
        id="pricing-faqs"
        {...sectionCopy('pricing', 'faqs')}
        items={pricingFaqs}
      />

      <ClosingCta id="cta" titleId="cta-title" {...cta} />
    </>
  )
}
