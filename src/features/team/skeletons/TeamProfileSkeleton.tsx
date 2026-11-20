import { SkeletonPage } from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonCta,
  SkeletonProfile,
} from '@/components/skeletons/SkeletonSections'

/**
 * Team profile skeleton: hero, profile strip, resume columns, the credentials
 * and contact cards, the skills band, and the closing CTA. The shared profile
 * composition already owns the page hero (without hero actions).
 */
export function TeamProfileSkeleton() {
  return (
    <SkeletonPage label="Loading team profile">
      <SkeletonProfile />
      <SkeletonCta />
    </SkeletonPage>
  )
}
