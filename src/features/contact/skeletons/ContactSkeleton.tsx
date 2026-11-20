import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonLine,
  SkeletonPage,
} from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonContactForm,
  SkeletonCta,
  SkeletonPageHero,
  SkeletonSectionHead,
} from '@/components/skeletons/SkeletonSections'
import * as S from '../styles/contact.styled'

const steps = ['one', 'two', 'three']
const assurances = ['one', 'two', 'three']

/**
 * Contact page skeleton: hero, inquiry card, next-steps aside and closing CTA.
 * The real page's layout styles keep the shapes aligned with the live content.
 */
export function ContactSkeleton() {
  return (
    <SkeletonPage label="Loading contact page">
      <SkeletonPageHero />

      <S.Layout>
        <S.FormColumn>
          <SkeletonContactForm />
        </S.FormColumn>

        <S.Aside>
          <SkeletonSectionHead />

          <S.Steps>
            {steps.map((step) => (
              <S.Step key={step}>
                <SkeletonCircle $size="2rem" />
                <S.StepCard>
                  <SkeletonBlock $w="3rem" $h="3rem" />
                  <S.Field>
                    <SkeletonLine $w="55%" $h="1rem" />
                    <SkeletonLine $w="100%" $h="0.75rem" />
                    <SkeletonLine $w="78%" $h="0.75rem" />
                  </S.Field>
                </S.StepCard>
              </S.Step>
            ))}
          </S.Steps>

          <S.Assurances>
            {assurances.map((assurance) => (
              <S.Assurance key={assurance}>
                <SkeletonCircle $size="1.75rem" />
                <SkeletonLine $w="70%" $h="0.75rem" />
              </S.Assurance>
            ))}
          </S.Assurances>

          <S.Callout>
            <SkeletonBlock $w="3rem" $h="3rem" />
            <S.Field>
              <SkeletonLine $w="50%" $h="1rem" />
              <SkeletonLine $w="90%" $h="0.75rem" />
              <SkeletonLine $w="65%" $h="0.75rem" />
            </S.Field>
          </S.Callout>
        </S.Aside>
      </S.Layout>

      <SkeletonCta />
    </SkeletonPage>
  )
}
