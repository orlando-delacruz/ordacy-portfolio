import { PageHeader } from '@/components/common/PageHeader'
import { ContentItems } from '@/components/ui/ContentItems'
import { Section } from '@/components/ui/Section'
import { faqs, getSection, pageHeader, plans, sectionCopy, seo } from '@/data'
import { Faq } from '@/features/home/sections/Faq'
import { PricingPlans } from '@/features/home/sections/Pricing'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import * as S from './styles/pricing-page.styled'

const pricingFaqs = faqs.filter((faq) => faq.pricingPage)

export function PricingPage() {
  usePageMeta(seo.pricing)
  useScrollReveal()

  return (
    <>
      <PageHeader {...pageHeader('pricing')} />

      <Section
        id="plans"
        {...sectionCopy('pricing', 'plans')}
      >
        <PricingPlans />
      </Section>

      <Section
        id="compare"
        {...sectionCopy('pricing', 'compare')}
      >
        <S.TableWrap role="region" aria-label="Plan comparison" tabIndex={0}>
          <S.Table>
            <caption>Comparison of Starter, Growth, and Custom plans</caption>
            <thead>
              <tr>
                <th scope="col">Details</th>
                {plans.map((plan) => (
                  <th key={plan.id} scope="col">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Best for</th>
                {plans.map((plan) => (
                  <td key={plan.id}>{plan.positioning}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Good fit for</th>
                {plans.map((plan) => (
                  <td key={plan.id}>
                    <S.List>
                      {plan.fits.map((fit) => (
                        <li key={fit}>{fit}</li>
                      ))}
                    </S.List>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Starting price</th>
                {plans.map((plan) => (
                  <td key={plan.id}>
                    {plan.prices.PHP && plan.prices.USD
                      ? `${plan.prices.PHP} / ${plan.prices.USD}`
                      : 'Quoted per project'}
                  </td>
                ))}
              </tr>
            </tbody>
          </S.Table>
        </S.TableWrap>
      </Section>

      <Section id="how-pricing-works" {...sectionCopy('pricing', 'how-pricing-works')}>
        <ContentItems
          items={getSection('pricing', 'how-pricing-works').items}
          variant="checklist"
        />
      </Section>

      <Faq
        id="pricing-faqs"
        {...sectionCopy('pricing', 'faqs')}
        items={pricingFaqs}
      />
    </>
  )
}
