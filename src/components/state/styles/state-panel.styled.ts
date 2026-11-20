import styled from 'styled-components'
import type { StateTone } from '../types'

export const Panel = styled.div<{ $compact?: boolean }>`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  max-width: 46rem;
  margin-inline: auto;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.md};
  text-align: center;
  text-wrap: pretty;

  ${({ $compact, theme }) =>
    $compact &&
    `
      padding-block: ${theme.spacing.sm};
    `}
`

export const IconTile = styled.span<{ $tone: StateTone }>`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $tone, theme }) =>
    $tone === 'error'
      ? `color-mix(in srgb, ${theme.colors.danger.text} 12%, ${theme.colors.surface.default})`
      : `color-mix(in srgb, ${theme.colors.text.accent} 12%, ${theme.colors.surface.default})`};
  color: ${({ $tone, theme }) =>
    $tone === 'error' ? theme.colors.danger.text : theme.colors.text.accent};
`

export const Title = styled.h2<{ $level: 1 | 2 }>`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $level }) =>
    $level === 1 ? 'clamp(2rem, 5vw, 2.5rem)' : 'clamp(1.5rem, 4vw, 2rem)'};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  text-wrap: balance;
`

export const Description = styled.p`
  max-width: 46ch;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};

  & > * {
    flex: 1 1 auto;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    & > * {
      flex: 0 0 auto;
    }
  }
`
