import { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {
  desktopItemActiveStyles,
  desktopItemStyles,
} from './navigation.styles'
import {
  primaryNavItems,
  secondaryNavItems,
  sidebarWidths,
} from './navigation'
import { BrandLogo, Wordmark } from './Wordmark'

type DesktopSidebarProps = {
  collapsed: boolean
}

const Sidebar = styled.aside<{ $collapsed: boolean }>`
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

const BrandRow = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? 'center' : 'flex-start'};
  min-height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

const BrandLink = styled(Link)<{ $collapsed: boolean }>`
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

const BrandWordmark = styled.span<{ $collapsed: boolean }>`
  display: flex;
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '10rem')};
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition:
    max-width ${({ theme }) => theme.transitions.slow},
    opacity ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
`

const Nav = styled.nav`
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-y: auto;
`

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  border: 0;
  background: ${({ theme }) => theme.colors.border.default};
`

const NavItem = styled(NavLink)<{ $collapsed: boolean }>`
  ${desktopItemStyles}

  &[aria-current='page'] {
    ${desktopItemActiveStyles}
  }
`

const Label = styled.span<{ $collapsed: boolean }>`
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '10rem')};
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition:
    max-width ${({ theme }) => theme.transitions.slow},
    opacity ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
`

export function DesktopSidebar({ collapsed }: DesktopSidebarProps) {
  const navItems = [...primaryNavItems, ...secondaryNavItems]

  return (
    <Sidebar $collapsed={collapsed} aria-label="Ordacy sidebar">
      <BrandRow $collapsed={collapsed}>
        <BrandLink
          to="/"
          $collapsed={collapsed}
          aria-label="Ordacy home"
        >
          <BrandLogo />
          <BrandWordmark $collapsed={collapsed}>
            <Wordmark />
          </BrandWordmark>
        </BrandLink>
      </BrandRow>

      <Nav id="desktop-primary-navigation" aria-label="Primary navigation">
        {navItems.map((item, index) => {
          const Icon = item.icon

          return (
            <Fragment key={item.to}>
              {index === primaryNavItems.length && (
                <Divider aria-hidden="true" />
              )}
              <NavItem
                to={item.to}
                end={item.end}
                $collapsed={collapsed}
                data-tooltip={collapsed ? item.label : undefined}
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
                <Label $collapsed={collapsed}>{item.label}</Label>
              </NavItem>
            </Fragment>
          )
        })}
      </Nav>
    </Sidebar>
  )
}
