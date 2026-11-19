import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { fluidFont } from '@/styles/typography'
import * as nav from './navigation.styled'
import { sidebarWidths } from '../navigation'

export const Sidebar = styled.aside<{ $collapsed: boolean }>`
  position: fixed;
  inset-block: 0;
  /* Follow the centered application wrapper on ultra-wide screens instead
     of sticking to the viewport edge. */
  left: max(
    0px,
    calc((100vw - ${({ theme }) => theme.layout.appMaxWidth}) / 2)
  );
  z-index: 20;
  display: none;
  flex-direction: column;
  width: ${({ $collapsed }) =>
    $collapsed ? sidebarWidths.collapsed : sidebarWidths.expanded};
  padding: ${({ theme }) => theme.spacing.md};
  border-right: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface.subtle};
  transition: width ${({ theme }) => theme.transitions.slow};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }
`

export const BrandRow = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? 'center' : 'flex-start'};
  min-height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const BrandLink = styled(Link)<{ $collapsed: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $collapsed, theme }) =>
    $collapsed ? '0' : theme.spacing.md};
  min-height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;

  &:hover {
    color: inherit;
  }
`

export const BrandWordmark = styled.span<{ $collapsed: boolean }>`
  display: flex;
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '10rem')};
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition:
    max-width ${({ theme }) => theme.transitions.slow},
    opacity ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
`

export const NavScroll = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
`

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

// Small caps section label above each nav group. Collapses to zero height so
// the icon rail keeps its even rhythm when the sidebar is closed.
export const GroupLabel = styled.p<{ $collapsed: boolean }>`
  max-height: ${({ $collapsed }) => ($collapsed ? '0' : '1.25rem')};
  margin: ${({ $collapsed, theme }) =>
    $collapsed ? '0' : `0 0 ${theme.spacing.xs}`};
  padding-inline: ${({ $collapsed, theme }) =>
    $collapsed ? '0' : theme.spacing.lg};
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fluidFont(0.6875)};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.12em;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  text-transform: uppercase;
  transition:
    max-height ${({ theme }) => theme.transitions.slow},
    margin ${({ theme }) => theme.transitions.slow},
    opacity ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
`

export const NavDivider = styled.hr<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
  margin: ${({ theme }) => `${theme.spacing.sm} 0 ${theme.spacing.md}`};
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const NavItem = styled(NavLink)<{ $collapsed: boolean }>`
  ${nav.desktopItemStyles}

  &[aria-current='page'] {
    ${nav.desktopItemActiveStyles}
  }
`

export const ItemIcon = styled.span`
  display: grid;
  flex: none;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: background ${({ theme }) => theme.transitions.base};

  a:hover &,
  a:focus-visible & {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 14%,
      transparent
    );
  }

  a[aria-current='page'] & {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 24%,
      transparent
    );
  }
`

export const Label = styled.span<{ $collapsed: boolean }>`
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '10rem')};
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition:
    max-width ${({ theme }) => theme.transitions.slow},
    opacity ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
`
