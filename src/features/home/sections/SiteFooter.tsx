import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import { primaryNavItems, secondaryNavItems } from '@/components/navigation/navigation'

const Footer = styled.footer`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding-block: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr);
  }
`

const Brand = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
`

const BrandRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Tagline = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

const NavGroup = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  align-content: start;
`

const GroupTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

const FooterLink = styled(Link)`
  justify-self: start;
  padding-block: calc(${({ theme }) => theme.spacing.xs} / 2);
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

const Copyright = styled.p`
  margin: ${({ theme }) => theme.spacing.xl} 0 0;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <Footer>
      <Grid>
        <Brand>
          <BrandRow>
            <BrandLogo />
            <Wordmark />
          </BrandRow>
          <Tagline>
            Build Better. Grow Further. Custom digital systems that help
            businesses manage operations, serve customers, and grow with
            greater clarity and control.
          </Tagline>
        </Brand>
        <NavGroup aria-label="Footer">
          <GroupTitle>Explore</GroupTitle>
          {primaryNavItems.map((item) => (
            <FooterLink key={item.to} to={item.to}>
              {item.label}
            </FooterLink>
          ))}
        </NavGroup>
        <NavGroup aria-label="Legal">
          <GroupTitle>Company</GroupTitle>
          {secondaryNavItems.map((item) => (
            <FooterLink key={item.to} to={item.to}>
              {item.label}
            </FooterLink>
          ))}
        </NavGroup>
      </Grid>
      <Copyright>© {year} Ordacy. All rights reserved.</Copyright>
    </Footer>
  )
}
