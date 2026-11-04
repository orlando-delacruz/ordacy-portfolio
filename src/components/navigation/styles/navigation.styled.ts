import { css } from 'styled-components'

export const compactTooltipStyles = css`
  &::after {
    position: absolute;
    top: 50%;
    left: calc(100% + ${({ theme }) => theme.spacing.md});
    z-index: 50;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.sm};
    background: ${({ theme }) => theme.colors.text.primary};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    color: ${({ theme }) => theme.colors.background.default};
    content: attr(data-tooltip);
    font-size: ${({ theme }) => theme.typography.fontSizes.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    opacity: 0;
    pointer-events: none;
    transform: translate(-0.25rem, -50%);
    transition:
      opacity ${({ theme }) => theme.transitions.fast},
      transform ${({ theme }) => theme.transitions.fast},
      visibility ${({ theme }) => theme.transitions.fast};
    visibility: hidden;
    white-space: nowrap;
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
    transform: translate(0, -50%);
    visibility: visible;
  }
`

export const desktopItemStyles = css<{ $collapsed: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? 'center' : 'flex-start'};
  gap: ${({ $collapsed, theme }) =>
    $collapsed ? '0' : theme.spacing.md};
  width: 100%;
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-align: left;
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  ${({ $collapsed }) => $collapsed && compactTooltipStyles}

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    /* Expanded items get breathing room on the left; collapsed items keep
       symmetric padding so the icon stays centered in the rail. */
    padding-left: ${({ $collapsed, theme }) =>
      $collapsed ? theme.spacing.sm : '1.5rem'};
  }
`

export const desktopItemActiveStyles = css`
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  color: ${({ theme }) => theme.colors.text.accent};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const mobileItemStyles = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  min-height: 3.5rem;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: transparent;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#ffffff' : '#000000')};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  opacity: 0.7;
  text-decoration: none;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const mobileItemActiveStyles = css`
  color: ${({ theme }) => theme.colors.text.accent};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  opacity: 1;
`
