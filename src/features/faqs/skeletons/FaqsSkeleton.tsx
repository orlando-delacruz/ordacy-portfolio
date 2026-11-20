import { SkeletonPage } from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonCta,
  SkeletonFaqWorkspace,
  SkeletonPageHero,
} from '@/components/skeletons/SkeletonSections'

/**
 * FAQ page skeleton: hero, the search/topic workspace with accordion rows,
 * and the closing CTA. The shared workspace owns its single section head.
 */
export function FaqsSkeleton() {
  return (
    <SkeletonPage label="Loading FAQs page">
      <SkeletonPageHero />
      <SkeletonFaqWorkspace />
      <SkeletonCta />
    </SkeletonPage>
  )
}
