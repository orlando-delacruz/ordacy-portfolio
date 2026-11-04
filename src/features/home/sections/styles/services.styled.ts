import styled from 'styled-components'
import { cardShell } from '../../components/styles/card.styled'

export { IconBadge } from '../../components/styles/icon-badge.styled'

export const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

export const Card = styled.li`
  ${cardShell}
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  align-content: start;
  align-items: start;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const CardTitle = styled.h3`
  margin: 0;
  align-self: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const CardText = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
