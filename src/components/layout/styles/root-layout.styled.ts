import styled from 'styled-components'
import { sidebarWidths } from '@/components/navigation/navigation'

export const Shell = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
`

export const SkipLink = styled.a`
  position: fixed;
  top: 0;
  left: ${({ theme }) => theme.spacing.md};
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.md};
  border-radius: 0 0 ${({ theme }) => theme.radii.sm}
    ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.background.default};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-decoration: none;
  transform: translateY(-120%);
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:focus {
    color: ${({ theme }) => theme.colors.background.default};
    transform: translateY(0);
  }
`

export const Content = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
  transition: margin-left ${({ theme }) => theme.transitions.slow};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    /* Margin tracks the fixed sidebar, including its ultra-wide offset, so
       content never slides underneath it. */
    margin-left: ${({ $collapsed, theme }) =>
      `calc(${$collapsed ? sidebarWidths.collapsed : sidebarWidths.expanded} + max(0px, (100vw - ${theme.layout.appMaxWidth}) / 2))`};
    /* Cap the content region so sidebar and content stay together inside the
       centered application wrapper instead of drifting apart ultra-wide. */
    margin-right: auto;
    max-width: ${({ $collapsed, theme }) =>
      `calc(${theme.layout.appMaxWidth} - ${$collapsed ? sidebarWidths.collapsed : sidebarWidths.expanded})`};
  }
`

export const Main = styled.main`
  flex: 1;
  min-width: 0;
`

export const MainInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  margin-inline: auto;
  padding: ${({ theme }) => theme.spacing.xl}
    ${({ theme }) => theme.spacing.lg};
  /* Clears the floating bottom nav (~5rem incl. its 1rem offset) plus a little air. */
  padding-bottom: calc(6rem + env(safe-area-inset-bottom));

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-bottom: ${({ theme }) => theme.spacing.xl};
  }
`
