import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { Tone } from '../../components/styles/admin-ui.styled'

const toneColor = (tone: Tone) =>
  ({ theme }: { theme: import('styled-components').DefaultTheme }) =>
    tone === 'danger' ? theme.colors.danger.text : theme.colors.status[tone]

export const Caption = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
`

export const Columns = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  }
`

export const SideStack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`

// Inbox hero figure: one confident number, not four equal cards.
export const InboxHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const InboxTotal = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const InboxLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const RecentHeading = styled.h3`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const PanelLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const RecentList = styled.ul`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.sm};
    padding-block: ${({ theme }) => theme.spacing.sm};
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  }
`

export const Bar = styled.div`
  display: flex;
  gap: 2px;
  height: 0.75rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const BarSegment = styled.span<{ $tone: Tone; $weight: number }>`
  flex: ${({ $weight }) => $weight} 1 0;
  background: ${({ $tone }) => toneColor($tone)};
`

export const Legend = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  li {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  strong {
    margin-left: auto;
    color: ${({ theme }) => theme.colors.text.primary};
    font-variant-numeric: tabular-nums;
  }
`

export const Swatch = styled.span<{ $tone: Tone }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 3px;
  background: ${({ $tone }) => toneColor($tone)};
`

export const ContentList = styled.ul`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.sm};
    padding-block: ${({ theme }) => theme.spacing.sm};
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }

  a {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.text.accent};
    }
  }

  strong {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-variant-numeric: tabular-nums;
  }
`

export const Actions = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  a {
    min-height: 2.75rem;
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    white-space: normal;
  }

  a svg {
    flex: none;
  }
`
