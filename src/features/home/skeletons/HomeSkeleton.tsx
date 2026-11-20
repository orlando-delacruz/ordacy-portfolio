import {
  SkeletonBlock,
  SkeletonButton,
  SkeletonCircle,
  SkeletonLine,
  SkeletonPage,
  SkeletonPill,
} from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonCta,
  SkeletonHomeHero,
  SkeletonPlanCards,
  SkeletonProjectCarousel,
  SkeletonSectionHead,
} from '@/components/skeletons/SkeletonSections'
import * as Section from '@/components/ui/styles/section.styled'
import * as TestimonialCard from '@/features/testimonials/styles/testimonial-card.styled'
import * as Faq from '../sections/styles/faq.styled'
import * as Process from '../sections/styles/process.styled'
import * as Testimonials from '../sections/styles/testimonials.styled'

const marqueeCards = ['one', 'two', 'three', 'four']
const processSteps = ['one', 'two', 'three', 'four']
const faqRows = ['one', 'two', 'three', 'four', 'five']

/**
 * Home page skeleton: profile hero, plans, project carousel, testimonial
 * marquee, process rail, FAQ list and closing CTA. The section compositions
 * reuse the real section styles so the placeholder keeps the page rhythm.
 */
export function HomeSkeleton() {
  return (
    <SkeletonPage label="Loading home page">
      <SkeletonHomeHero />
      <SkeletonPlanCards />
      <SkeletonProjectCarousel />

      <Section.Wrapper>
        <SkeletonSectionHead />
        <Testimonials.Viewport>
          <Testimonials.Track $duration={60} $paused as="div">
            {marqueeCards.map((card) => (
              <TestimonialCard.Card
                key={card}
                $layout="marquee"
                as="div"
              >
                <TestimonialCard.Top>
                  <SkeletonPill $w="5rem" />
                  <SkeletonCircle $size="2rem" />
                </TestimonialCard.Top>
                <TestimonialCard.Quotation as="div" $expanded>
                  <SkeletonLine $w="100%" />
                  <SkeletonLine $w="94%" />
                  <SkeletonLine $w="86%" />
                  <SkeletonLine $w="62%" />
                </TestimonialCard.Quotation>
                <TestimonialCard.Author as="div">
                  <SkeletonCircle $size="2.75rem" />
                  <TestimonialCard.AuthorInfo>
                    <SkeletonLine $w="55%" $h="0.75rem" />
                    <SkeletonLine $w="75%" $h="0.75rem" />
                  </TestimonialCard.AuthorInfo>
                </TestimonialCard.Author>
              </TestimonialCard.Card>
            ))}
          </Testimonials.Track>
        </Testimonials.Viewport>
        <Testimonials.Actions>
          <SkeletonButton $w="12rem" />
        </Testimonials.Actions>
      </Section.Wrapper>

      <Section.Wrapper>
        <SkeletonSectionHead />
        <Process.Timeline data-revealed>
          {processSteps.map((step, index) => (
            <Process.Step key={step} $index={index}>
              <Process.Marker>
                <SkeletonCircle $size="2.5rem" />
              </Process.Marker>
              <Process.StepBody>
                <Process.StepLabel as="div">
                  <SkeletonLine $w="4rem" $h="0.75rem" />
                </Process.StepLabel>
                <Process.StepTitle as="div">
                  <SkeletonLine $w="75%" $h="1.25rem" />
                </Process.StepTitle>
                <Process.StepText as="div">
                  <SkeletonBlock $h="3rem" />
                </Process.StepText>
              </Process.StepBody>
            </Process.Step>
          ))}
        </Process.Timeline>
      </Section.Wrapper>

      <Section.Wrapper>
        <SkeletonSectionHead />
        <Faq.Layout>
          <Faq.List data-static>
            {faqRows.map((row, index) => (
              <Faq.Item key={row} $index={index}>
                <Faq.Question as="div">
                  <SkeletonLine $w="78%" $h="1rem" />
                  <SkeletonCircle $size="2rem" />
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
