import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import * as S from './styles/page-hero.styled'

type PageHeroProps = {
  /** The H1's id, used by the page's `aria-labelledby`. */
  titleId: string
  eyebrow: string
  badgeIcon: LucideIcon
  title: string
  /** Phrase rendered in teal as the final line of the title. */
  accent?: string
  description: string
  /** Optional page-specific background; defaults to the shared teal wave. */
  image?: string
  /** Optional decorative layer rendered behind the veil (team cover art). */
  art?: ReactNode
  /** Page-specific primary and ghost actions. */
  actions?: ReactNode
}

/**
 * The shared page hero: navy teal-wave band, badge, split H1, lead and
 * action row. Home keeps its profile hero; every other page uses this.
 */
export function PageHero({
  titleId,
  eyebrow,
  badgeIcon,
  title,
  accent,
  description,
  image,
  art,
  actions,
}: PageHeroProps) {
  const BadgeIcon = badgeIcon
  const hasAccent = Boolean(accent && title.includes(accent))
  const titleStart = hasAccent && accent ? title.split(accent)[0] : title

  return (
    <S.Hero aria-labelledby={titleId} data-print-hide>
      <S.HeroBand $image={image}>
        {art && <S.Art aria-hidden="true">{art}</S.Art>}

        <S.HeroGrid>
          <S.HeroCopy>
            <S.HeroBadge>
              <BadgeIcon size={14} strokeWidth={2.5} aria-hidden="true" />
              {eyebrow}
            </S.HeroBadge>
            <S.HeroTitle id={titleId}>
              {titleStart}
              {hasAccent && accent && <S.Accent>{accent}</S.Accent>}
            </S.HeroTitle>
            <S.HeroLead>{description}</S.HeroLead>
            {actions && <S.Actions>{actions}</S.Actions>}
          </S.HeroCopy>
        </S.HeroGrid>
      </S.HeroBand>
    </S.Hero>
  )
}
