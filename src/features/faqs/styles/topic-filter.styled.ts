import styled from 'styled-components'

export const Nav = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const List = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0 0 ${({ theme }) => theme.spacing.xs};
  overflow-x: auto;
  list-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: grid;
    gap: 2px;
    overflow: visible;
    padding-bottom: 0;
  }
`

export const Item = styled.li`
  flex: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 100%;
  }
`

export const Button = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? 'transparent' : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.brand.primary : theme.colors.background.subtle};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.brand.navy : theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ $active, theme }) =>
      $active ? 'transparent' : theme.colors.text.accent};
    background: ${({ $active, theme }) =>
      $active
        ? theme.colors.brand.secondary
        : `color-mix(in srgb, ${theme.colors.text.accent} 6%, ${theme.colors.background.subtle})`};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.brand.navy : theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`

export const Count = styled.span`
  display: inline-grid;
  place-items: center;
  min-width: 1.25rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-variant-numeric: tabular-nums;
`
