import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-decoration: none;
  white-space: nowrap;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }

  &:active {
    transform: scale(0.98);
  }
`

export const PrimaryButton = styled(Link)`
  ${baseStyles}
  border: 1px solid transparent;
  /* Theme-adaptive primary action: dark text on light teal in light mode,
     white text on dark teal in dark mode. The dark-teal shades use explicit
     hex values because brand.deep is redefined per theme. */
  background: ${({ theme }) =>
    theme.mode === 'dark' ? '#007C6C' : theme.colors.brand.primary};
  color: ${({ theme }) =>
    theme.mode === 'dark' ? '#ffffff' : theme.colors.brand.navy};

  &:hover {
    background: ${({ theme }) =>
      theme.mode === 'dark' ? '#006A5C' : theme.colors.brand.secondary};
    color: ${({ theme }) =>
      theme.mode === 'dark' ? '#ffffff' : theme.colors.brand.navy};
  }
`

export const SecondaryButton = styled(Link)`
  ${baseStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }
`
