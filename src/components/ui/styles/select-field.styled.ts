import styled from 'styled-components'
import type { AppTheme } from '@/styles/theme'

export const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
`

export const Label = styled.label`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.35;
`

export const Optional = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
`

export const Control = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const LeadingIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  z-index: 1;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  transition: color ${({ theme }) => theme.transitions.base};

  ${Control}:focus-within & {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

// Control boundaries need 3:1 against their surface; the softer card border
// does not. Match the contact form's light/dark mixes.
const controlBorder = (theme: AppTheme) =>
  theme.mode === 'dark'
    ? `color-mix(in srgb, ${theme.colors.text.secondary} 55%, ${theme.colors.surface.default})`
    : `color-mix(in srgb, ${theme.colors.text.secondary} 75%, ${theme.colors.surface.default})`

export const Select = styled.select`
  width: 100%;
  min-height: 2.75rem;
  padding: 0 2.75rem 0 2.25rem;
  border: 1px solid ${({ theme }) => controlBorder(theme)};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  text-overflow: ellipsis;
  white-space: nowrap;
  appearance: none;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.base},
    background-color ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.border.focus};
    background-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.border.focus} 4%,
      ${({ theme }) => theme.colors.surface.default}
    );
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 1px;
  }

  &::-ms-expand {
    display: none;
  }
`

export const Chevron = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  transition: color ${({ theme }) => theme.transitions.base};

  ${Control}:focus-within & {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`
