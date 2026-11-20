import type { ReactNode } from 'react'
import { VisuallyHidden } from '@/components/state/VisuallyHidden'

export {
  Block as SkeletonBlock,
  Line as SkeletonLine,
  Circle as SkeletonCircle,
  Card as SkeletonCard,
  ButtonBlock as SkeletonButton,
  PillBlock as SkeletonPill,
} from './styles/skeletons.styled'

type SkeletonPageProps = {
  label: string
  children: ReactNode
}

/**
 * The accessible shell for every skeleton: one polite status region with a
 * visually hidden loading label, and purely decorative visual shapes.
 */
export function SkeletonPage({ label, children }: SkeletonPageProps) {
  return (
    <div role="status" aria-busy="true">
      <VisuallyHidden>{label}</VisuallyHidden>
      <div aria-hidden="true">{children}</div>
    </div>
  )
}
