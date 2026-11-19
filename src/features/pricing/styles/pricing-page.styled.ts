import styled, { css } from 'styled-components'

// The table only appears where it fits without scrolling; below xl the
// comparison becomes a stacked plan list.
export const TableWrap = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: block;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.surface.default};
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  text-align: left;

  caption {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  th,
  td {
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
    vertical-align: top;
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    overflow-wrap: break-word;
  }

  tbody tr:last-child > * {
    border-bottom: 0;
  }

  thead th {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }

  tbody th {
    width: 11rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  td {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    th,
    td {
      padding: ${({ theme }) => theme.spacing.md}
        ${({ theme }) => theme.spacing.lg};
    }
  }
`

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: ${({ theme }) => theme.spacing.md};

    &::before {
      position: absolute;
      top: 0.5rem;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: ${({ theme }) => theme.radii.round};
      background: ${({ theme }) => theme.colors.text.accent};
      content: '';
    }
  }
`

// Growth-column highlight for the comparison table only (not a plan-card
// tint). color-mix keeps it subtle in both light and dark modes.
const featuredCell = css`
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 9%,
    ${({ theme }) => theme.colors.surface.default}
  );
`

export const PlanHead = styled.th<{ $featured?: boolean }>`
  ${({ $featured }) => $featured && featuredCell}

  /* Accent marker under the featured plan's header. */
  ${({ $featured, theme }) =>
    $featured &&
    `box-shadow: inset 0 -2px 0 ${theme.colors.text.accent};`}
`

export const PlanCell = styled.td<{ $featured?: boolean }>`
  ${({ $featured }) => $featured && featuredCell}
`

export const PlanIcon = styled.span`
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.text.accent} 12%, ${theme.colors.surface.default})`};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const PlanName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Price = styled.span<{ $featured?: boolean }>`
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ $featured, theme }) =>
    $featured ? theme.colors.text.accent : theme.colors.text.primary};
`

/* Below xl the comparison becomes one plan group per row: the table needs
   horizontal scrolling otherwise, which hides two plans at a time. */
export const CompareStack = styled.div`
  display: grid;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: none;
  }
`

export const ComparePlan = styled.section<{ $featured?: boolean }>`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  }

  ${({ $featured }) => $featured && featuredCell}

  ${({ $featured }) =>
    $featured &&
    css`
      && {
        border-top: 0;
      }
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const ComparePlanHead = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    letter-spacing: -0.01em;
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  }
`

export const CompareDetails = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
`

export const CompareRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};

  dt {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  }

  dd {
    min-width: 0;
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 8rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
    align-items: start;
  }
`

export const ComparePrice = styled(Price)`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`
