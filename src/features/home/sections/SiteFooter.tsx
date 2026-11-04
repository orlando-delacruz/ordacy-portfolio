import { ArrowUp, Building2, ChevronRight, Compass } from 'lucide-react'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import { primaryNavItems, secondaryNavItems } from '@/components/navigation/navigation'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import * as S from './styles/site-footer.styled'

const groups = [
  { title: 'Explore', area: 'explore', icon: Compass, items: primaryNavItems },
  { title: 'Company', area: 'company', icon: Building2, items: secondaryNavItems },
] as const

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  // Columns rise in one after another the first time the footer is seen.
  const [footerRef, revealed] = useRevealOnce<HTMLElement>(0.15)

  return (
    <S.Footer ref={footerRef} data-revealed={revealed || undefined}>
      <S.Decor aria-hidden="true">
        <S.Ring />
        <S.DotGrid />
        <S.Watermark>Ordacy</S.Watermark>
      </S.Decor>

      <S.TopLine aria-hidden="true" />

      <S.Grid>
        <S.Brand $index={0}>
          <S.BrandRow>
            <BrandLogo />
            <Wordmark />
          </S.BrandRow>
          <S.Tagline>
            Build Better. Grow Further. Custom digital systems that help
            businesses manage operations, serve customers, and grow with
            greater clarity and control.
          </S.Tagline>
        </S.Brand>
        {groups.map((group, groupIndex) => {
          const GroupIcon = group.icon
          return (
            <S.NavGroup
              key={group.area}
              aria-label={group.title}
              $area={group.area}
              $index={groupIndex + 1}
            >
              <S.GroupTitle>
                <S.GroupIcon aria-hidden="true">
                  <GroupIcon size={14} strokeWidth={2.25} />
                </S.GroupIcon>
                {group.title}
              </S.GroupTitle>
              <S.LinkList>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.to}>
                      <S.FooterLink to={item.to}>
                        <S.LinkIcon aria-hidden="true">
                          <Icon size={16} strokeWidth={2} />
                        </S.LinkIcon>
                        <S.LinkLabel>{item.label}</S.LinkLabel>
                        <S.LinkPointer aria-hidden="true">
                          <ChevronRight size={14} strokeWidth={2.5} />
                        </S.LinkPointer>
                      </S.FooterLink>
                    </li>
                  )
                })}
              </S.LinkList>
            </S.NavGroup>
          )
        })}
      </S.Grid>

      <S.Bottom data-reveal="1">
        <S.Copyright>© {year} Ordacy. All rights reserved.</S.Copyright>
        <S.BackToTop type="button" onClick={scrollToTop}>
          Back to top
          <S.BackToTopIcon aria-hidden="true">
            <ArrowUp size={16} strokeWidth={2.25} />
          </S.BackToTopIcon>
        </S.BackToTop>
      </S.Bottom>
    </S.Footer>
  )
}
