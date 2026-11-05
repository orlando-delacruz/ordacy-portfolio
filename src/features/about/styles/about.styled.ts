import styled from 'styled-components'

export { PrimaryButton } from '@/components/ui/styles/buttons.styled'

export const Lead = styled.p`
  max-width: 44rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

// Ruled list instead of cards: each service is a row with its icon.
export const Services = styled.ul`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing['2xl']};
  }
`

export const Service = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};

  svg {
    margin-top: 0.125rem;
    color: ${({ theme }) => theme.colors.text.accent};
  }

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  p {
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }
`

// Vertical timeline: a rail with numbered markers.
export const Timeline = styled.ol`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;

  &::before {
    position: absolute;
    top: 1rem;
    bottom: 1rem;
    left: 1rem;
    width: 2px;
    background: ${({ theme }) => theme.colors.border.default};
    content: '';
  }
`

export const TimelineItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  counter-increment: step;

  &::before {
    z-index: 1;
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: ${({ theme }) => theme.radii.round};
    background: ${({ theme }) => theme.colors.background.subtle};
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    content: counter(step);
  }

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }

  p {
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
    max-width: 40rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }
`

export const Closing = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
`

export const SolvedBy = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`
