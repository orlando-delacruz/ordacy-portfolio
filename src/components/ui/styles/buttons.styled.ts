import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const baseStyles = css`
  /* Contains any visually hidden (absolute) text inside the button. */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
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

const primaryStyles = css`
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

const secondaryStyles = css`
  ${baseStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const PrimaryButton = styled(Link)`
  ${primaryStyles}
`

export const SecondaryButton = styled(Link)`
  ${secondaryStyles}
`

/** Same look as PrimaryButton, for external links (plain <a>). */
export const PrimaryAnchor = styled.a`
  ${primaryStyles}
`

/** Same look as PrimaryButton, for form submits (real <button>). */
export const PrimaryAction = styled.button`
  ${primaryStyles}
  font-family: inherit;
  cursor: pointer;

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }
`

/** Same look as SecondaryButton, for in-page actions (real <button>). */
export const SecondaryAction = styled.button`
  ${secondaryStyles}
`
