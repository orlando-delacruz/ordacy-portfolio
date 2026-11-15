import styled from 'styled-components'

// Split view: page list beside the editor on desktop, scrollable row on mobile.
export const Split = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 15rem minmax(0, 1fr);
  }
`

export const PageNav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: 5rem;
    display: grid;
    overflow: visible;
    padding-bottom: 0;
  }
`

export const PageNavButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.5rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.text.accent : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.background.subtle : theme.colors.surface.default};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text.accent : theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  white-space: nowrap;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
    justify-content: flex-start;
  }
`
