import styled from 'styled-components'

export { PrimaryButton } from '@/components/ui/styles/buttons.styled'

// Editorial list: one wide quote per row, attribution beside it on desktop.
export const List = styled.ul`
  display: grid;
  margin: 0;
  padding: 0 0 ${({ theme }) => theme.spacing['3xl']};
  list-style: none;
`

export const Item = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2.5fr);
    gap: ${({ theme }) => theme.spacing['2xl']};
  }
`

export const Attribution = styled.footer`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  align-content: start;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }
`

export const Quote = styled.blockquote`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
`