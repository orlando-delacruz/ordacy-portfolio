import styled, { css } from 'styled-components'

type Variant = 'numbered' | 'ruled' | 'checklist'

export const List = styled.ul<{ $variant: Variant }>`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.xl};
  }

  ${({ $variant }) =>
    $variant !== 'checklist' &&
    css`
      @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    `}

  ${({ $variant }) =>
    $variant === 'checklist' &&
    css`
      gap: ${({ theme }) => theme.spacing.md};
      padding: ${({ theme }) => theme.spacing.lg};
      border: 1px solid ${({ theme }) => theme.colors.border.default};
      border-radius: ${({ theme }) => theme.radii.lg};
      background: ${({ theme }) => theme.colors.background.subtle};

      @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.xl};
      }
    `}
`

export const Item = styled.li<{ $variant: Variant }>`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ $variant }) =>
    $variant === 'ruled' &&
    css`
      padding-top: ${({ theme }) => theme.spacing.md};
      border-top: 2px solid ${({ theme }) => theme.colors.text.accent};
    `}

  ${({ $variant }) =>
    $variant === 'numbered' &&
    css`
      padding: ${({ theme }) => theme.spacing.lg};
      border: 1px solid ${({ theme }) => theme.colors.border.default};
      border-radius: ${({ theme }) => theme.radii.lg};
      background: ${({ theme }) => theme.colors.surface.default};
    `}

  ${({ $variant }) =>
    $variant === 'checklist' &&
    css`
      grid-template-columns: auto minmax(0, 1fr);
      gap: ${({ theme }) => theme.spacing.md};
    `}
`

export const Index = styled.span`
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1;
`

export const Check = styled.span`
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 0.125rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.text.accent};
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
`

export const Text = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
