import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Footer = styled.footer`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding-block: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr);
  }
`

export const Brand = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
`

export const BrandRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Tagline = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const NavGroup = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  align-content: start;
`

export const GroupTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const FooterLink = styled(Link)`
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

export const Copyright = styled.p`
  margin: ${({ theme }) => theme.spacing.xl} 0 0;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`
