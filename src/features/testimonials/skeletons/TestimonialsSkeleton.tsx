import {
  SkeletonCircle,
  SkeletonLine,
  SkeletonPage,
} from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonCta,
  SkeletonPageHero,
  SkeletonSectionHead,
  SkeletonTestimonialCards,
} from '@/components/skeletons/SkeletonSections'
import * as Section from '@/components/ui/styles/section.styled'
import * as Journey from '../styles/journey.styled'

const journeySteps = ['one', 'two', 'three', 'four']

/**
 * Testimonials page skeleton: hero, the feedback card grid with pagination,
 * the project journey rail, and the closing CTA.
 */
export function TestimonialsSkeleton() {
  return (
    <SkeletonPage label="Loading testimonials page">
      <SkeletonPageHero />
      <SkeletonTestimonialCards />

      <Section.Wrapper>
        <SkeletonSectionHead />
        <Journey.List data-revealed>
          {journeySteps.map((step, index) => (
            <Journey.Item key={step} $index={index}>
              <Journey.Node aria-hidden="true">
                <SkeletonCircle $size="1.25rem" />
              </Journey.Node>
              <Journey.Body>
                <Journey.Title as="div">
                  <SkeletonLine $w="70%" $h="1rem" />
                </Journey.Title>
              </Journey.Body>
            </Journey.Item>
          ))}
        </Journey.List>
      </Section.Wrapper>

      <SkeletonCta />
    </SkeletonPage>
  )
}
