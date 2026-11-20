import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  PrimaryAction as BasePrimaryAction,
  SecondaryAction as BaseSecondaryAction,
} from '@/components/ui/styles/buttons.styled'

export const Page = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 100vh;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background.default};
`

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 4rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-inline: ${({ theme }) => theme.spacing.xl};
  }
`

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
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

export const Tag = styled.span`
  padding: 0.125rem ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const Main = styled.main`
  display: grid;
  align-content: center;
  justify-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing['2xl']};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['2xl']};
  }
`

export const Card = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 28rem;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

export const CardHeader = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-items: start;

  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }
`

export const StepHeader = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }
`

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

export const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const Input = styled.input<{ $invalid?: boolean; $code?: boolean }>`
  width: 100%;
  min-height: 2.75rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $invalid, theme }) =>
      $invalid ? theme.colors.danger.text : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  ${({ $code, theme }) =>
    $code &&
    `
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: ${theme.typography.fontSizes.lg};
    letter-spacing: 0.3em;
  `}

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.border.focus};
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 1px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const Hint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

export const Alert = styled.p`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.danger.text} 40%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radii.sm};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.danger.text} 8%,
    transparent
  );
  color: ${({ theme }) => theme.colors.danger.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};

  svg {
    flex: none;
    margin-top: 0.125rem;
  }
`

export const Submit = styled(BasePrimaryAction)`
  width: 100%;
  min-height: 2.75rem;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const Secondary = styled(BaseSecondaryAction)`
  width: 100%;
  min-height: 2.75rem;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const QrWrap = styled.div`
  display: grid;
  justify-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};

  img {
    width: 13rem;
    height: 13rem;
  }
`

export const SecretBlock = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};

  code {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radii.sm};
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    overflow-wrap: anywhere;
  }
`

export const Checking = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  svg[data-spin] {
    @media (prefers-reduced-motion: no-preference) {
      animation: spin 900ms linear infinite;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`
