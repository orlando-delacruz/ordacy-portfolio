import styled from 'styled-components'

export { PrimaryButton } from '@/components/ui/styles/buttons.styled'

// Responsive card grid: one column on mobile, up to three on desktop.
export const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0 0 ${({ theme }) => theme.spacing['3xl']};
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
`