import styled from 'styled-components'

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
  min-width: 40rem;
  border-collapse: collapse;
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
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
    vertical-align: top;
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
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
`

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;
`
