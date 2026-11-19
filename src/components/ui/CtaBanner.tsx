import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import * as S from './styles/cta-banner.styled'

type CtaBannerProps = {
  /** Optional anchor id for pages that link to the banner. */
  id?: string
  /** The heading's id, used for `aria-labelledby`. */
  titleId: string
  eyebrow?: { icon: LucideIcon; label: string }
  title: string
  description: string
  children: ReactNode
}

/**
 * The site's one full-color surface: brand teal with navy ink, a single ring,
 * and a scroll-triggered entrance. Every public page closes with it.
 */
export function CtaBanner({
  id,
  titleId,
  eyebrow,
  title,
  description,
  children,
}: CtaBannerProps) {
  // The ring eases in the first time the banner is seen.
  const [bannerRef, revealed] = useRevealOnce<HTMLElement>(0.3)
  const EyebrowIcon = eyebrow?.icon

  return (
    // Page-wide scroll fade on the wrapper; the banner's data-revealed drives
    // the ring's own entrance.
    <div data-reveal="" data-print-hide>
      <S.Banner
        ref={bannerRef}
        id={id}
        data-revealed={revealed || undefined}
        aria-labelledby={titleId}
      >
        <S.Decor aria-hidden="true">
          <S.RingLarge />
        </S.Decor>

        <S.Copy>
          {eyebrow && eyebrow.label && EyebrowIcon && (
            <S.Eyebrow>
              <EyebrowIcon size={16} strokeWidth={2} aria-hidden="true" />
              {eyebrow.label}
            </S.Eyebrow>
          )}
          <S.Title id={titleId}>{title}</S.Title>
          <S.Description>{description}</S.Description>
        </S.Copy>

        <S.Actions>{children}</S.Actions>
      </S.Banner>
    </div>
  )
}
