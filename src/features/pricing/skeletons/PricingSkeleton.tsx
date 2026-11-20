import {
  SkeletonBlock,
  SkeletonButton,
  SkeletonLine,
  SkeletonPage,
} from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonComparison,
  SkeletonCta,
  SkeletonPageHero,
  SkeletonPlanCards,
  SkeletonSectionHead,
} from '@/components/skeletons/SkeletonSections'
import * as Section from '@/components/ui/styles/section.styled'
import * as Faq from '@/features/home/sections/styles/faq.styled'
import * as HowItWorks from '../styles/how-it-works.styled'

const steps = ['one', 'two', 'three', 'four']
const faqRows = ['one', 'two', 'three', 'four', 'five']

/**
 * Pricing page skeleton: hero, plan cards, the comparison stack/table,
 * how-it-works cards, FAQ rows, and the closing CTA.
 */
export function PricingSkeleton() {
  return (
    <SkeletonPage label="Loading pricing page">
      <SkeletonPageHero />
      <SkeletonPlanCards showCurrencyToggle />
      <SkeletonComparison />

      <Section.Wrapper>
        <SkeletonSectionHead />
        <HowItWorks.List>
          {steps.map((step) => (
            <HowItWorks.Item key={step}>
              <SkeletonBlock $w="2.5rem" $h="2.5rem" $r="0.5rem" />
              <HowItWorks.Body>
                <HowItWorks.Title as="div">
                  <SkeletonLine $w="75%" $h="0.875rem" />
                </HowItWorks.Title>
                <HowItWorks.Text as="div">
                  <SkeletonBlock $h="2rem" />
                </HowItWorks.Text>
              </HowItWorks.Body>
            </HowItWorks.Item>
          ))}
        </HowItWorks.List>
      </Section.Wrapper>

      <Section.Wrapper>
        <SkeletonSectionHead />
        <Faq.Layout>
          <Faq.List data-static>
            {faqRows.map((row, index) => (
              <Faq.Item key={row} $index={index}>
                <Faq.Question as="div">
                  <SkeletonLine $w="78%" $h="1rem" />
                  <SkeletonBlock $w="2rem" $h="2rem" $r="999px" />
                </Faq.Question>
              </Faq.Item>
            ))}
          </Faq.List>
          <Faq.Aside>
            <Faq.AsideActions>
              <SkeletonButton $w="7rem" />
              <SkeletonButton $w="7rem" />
            </Faq.AsideActions>
          </Faq.Aside>
        </Faq.Layout>
      </Section.Wrapper>

      <SkeletonCta />
    </SkeletonPage>
  )
}
