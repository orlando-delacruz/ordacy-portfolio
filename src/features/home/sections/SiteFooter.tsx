import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import { primaryNavItems, secondaryNavItems } from '@/components/navigation/navigation'
import * as S from './styles/site-footer.styled'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <S.Footer>
      <S.Grid>
        <S.Brand>
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
        <S.NavGroup aria-label="Explore">
          <S.GroupTitle>Explore</S.GroupTitle>
          {primaryNavItems.map((item) => (
            <S.FooterLink key={item.to} to={item.to}>
              {item.label}
            </S.FooterLink>
          ))}
        </S.NavGroup>
        <S.NavGroup aria-label="Company">
          <S.GroupTitle>Company</S.GroupTitle>
          {secondaryNavItems.map((item) => (
            <S.FooterLink key={item.to} to={item.to}>
              {item.label}
            </S.FooterLink>
          ))}
        </S.NavGroup>
      </S.Grid>
      <S.Copyright>© {year} Ordacy. All rights reserved.</S.Copyright>
    </S.Footer>
  )
}
