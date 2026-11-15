import styled from 'styled-components'
import { cardShell } from '@/components/ui/styles/card.styled'
import { IconBadgeCompact } from '@/components/ui/styles/icon-badge.styled'

export { IconBadgeCompact }

export const Resume = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  }
`

export const Main = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 0;
`

export const Side = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
`

export const Block = styled.section`
  ${cardShell}
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

export const BlockHeading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const BlockTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
`

export const Lead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Timeline = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const TimelineItem = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 2px solid ${({ theme }) => theme.colors.border.default};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const EntryTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const EntryMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const EntryText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Pills = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Pill = styled.li`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const MetaList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const MetaItem = styled.li`
  display: grid;
  gap: 0.125rem;
`

export const MetaName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const MetaDetail = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const ContactCard = styled.div`
  ${cardShell}
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  border-color: ${({ theme }) => theme.colors.text.accent};
`

export const ContactTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const ContactText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
