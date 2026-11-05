import { Link, NavLink as RouterNavLink } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'

const SIDEBAR_WIDTH = '16rem'

export const Shell = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: ${SIDEBAR_WIDTH} minmax(0, 1fr);
  }
`

export const SkipLink = styled.a`
  position: fixed;
  top: 0;
  left: ${({ theme }) => theme.spacing.md};
  z-index: 300;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 0 0 ${({ theme }) => theme.radii.sm} ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.background.default};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-decoration: none;
  transform: translateY(-120%);
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:focus {
    transform: translateY(0);
  }
`

/* ---------- Sidebar ---------- */

export const Sidebar = styled.aside`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    height: 100vh;
    height: 100dvh;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
    overflow-y: auto;
    border-right: 1px solid ${({ theme }) => theme.colors.border.default};
    background: ${({ theme }) => theme.colors.surface.subtle};
  }
`

export const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-inline: ${({ theme }) => theme.spacing.sm};
  color: inherit;
  text-decoration: none;

  img {
    width: 1.75rem;
    height: 1.75rem;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`

export const BrandTag = styled.span`
  padding: 0.125rem ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const Nav = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const NavGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const NavGroupLabel = styled.h2`
  margin: 0;
  padding-inline: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const NavList = styled.ul`
  display: grid;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const NavLink = styled(RouterNavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.5rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &.active {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

/* ---------- Content ---------- */

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
`

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 4rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.background.default} 92%,
    transparent
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-inline: ${({ theme }) => theme.spacing.xl};
  }
`

export const Breadcrumb = styled.nav`
  flex: 1;
  min-width: 0;

  ol {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }

  li {
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text.secondary};
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  li + li::before {
    margin-right: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.border.default};
    content: '/';
  }

  [aria-current='page'] {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }

  a {
    color: inherit;
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.text.accent};
    }
  }
`

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const TopIconButton = styled.button<{ $mobileOnly?: boolean }>`
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  ${({ $mobileOnly }) =>
    $mobileOnly &&
    css`
      @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        display: none;
      }
    `}
`

export const Profile = styled.div`
  position: relative;
`

export const ProfileButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 2.5rem;
  padding: 0.25rem ${({ theme }) => theme.spacing.sm} 0.25rem 0.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const Avatar = styled.span`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const ProfileName = styled.span`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: inline;
  }
`

const menuIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const ProfileMenu = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
  right: 0;
  z-index: 60;
  display: grid;
  width: min(16rem, calc(100vw - 2rem));
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (prefers-reduced-motion: no-preference) {
    animation: ${menuIn} 150ms ease-out;
  }
`

export const ProfileInfo = styled.div`
  display: grid;
  gap: 0.125rem;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  }
`

const profileLinkStyles = css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
  }
`

export const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing['2xl']};

  &:focus {
    outline: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

/* ---------- Drawer ---------- */

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`

export const Drawer = styled.dialog`
  width: min(20rem, 86vw);
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};

  &::backdrop {
    background: rgba(0, 20, 32, 0.6);
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: ${slideIn} 200ms ease-out;
  }
`

export const DrawerInner = styled.div`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.md};
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ProfileLink = styled(Link)`
  ${profileLinkStyles}
`

/** Same look as ProfileLink; a full page load so the public site re-reads saved content. */
export const ProfileAnchor = styled.a`
  ${profileLinkStyles}
`
