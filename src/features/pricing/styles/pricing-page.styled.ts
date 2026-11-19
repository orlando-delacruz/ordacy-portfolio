import styled, { css } from 'styled-components'

// Horizontal scroll on small screens; focusable so keyboard users can scroll it.
export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const Table = styled.table`
  width: 100%;
  /* Below xl the table scrolls horizontally, so give every plan cell a
     readable width instead of squeezing the lists into slivers. */
  min-width: 50rem;
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
    width: 7rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  td {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  /* Sticky row-label column: keeps context while the plans scroll
     horizontally on small screens. Opaque backgrounds required. */
  thead th:first-child,
  tbody th {
    position: sticky;
    left: 0;
    z-index: 1;
    border-right: 1px solid ${({ theme }) => theme.colors.border.default};
  }

  thead th:first-child {
    background: ${({ theme }) => theme.colors.background.subtle};
  }

  tbody th {
    background: ${({ theme }) => theme.colors.surface.default};
  }

  /* Desktop: the table fits the section again; plans get the extra room. */
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    min-width: 0;

    th,
    td {
      padding: ${({ theme }) => theme.spacing.md}
        ${({ theme }) => theme.spacing.lg};
    }

    tbody th {
      width: 11rem;
    }
  }
`

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;
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
