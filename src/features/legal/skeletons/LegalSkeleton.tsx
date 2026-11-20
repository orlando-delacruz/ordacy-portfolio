import { SkeletonPage } from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonCta,
  SkeletonLegalDoc,
  SkeletonPageHero,
} from '@/components/skeletons/SkeletonSections'

/**
 * Legal page skeleton: page hero, document meta, the TOC/body layout, and the
 * closing CTA. The shared document composition owns the TOC column.
 */
export function LegalSkeleton() {
  return (
    <SkeletonPage label="Loading legal page">
      <SkeletonPageHero />
      <SkeletonLegalDoc />
      <SkeletonCta />
    </SkeletonPage>
  )
}
