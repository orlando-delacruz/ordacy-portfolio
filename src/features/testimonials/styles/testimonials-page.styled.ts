import styled from 'styled-components'

export { SrOnly } from '@/features/home/sections/styles/projects.styled'

// Full-bleed mint wash behind the page. The background layer reaches the
// shell gutters while the content itself stays on the normal content grid.
export const Page = styled.div`
  position: relative;
  isolation: isolate;

  &::before {
    position: absolute;
    inset: 0 calc(-1 * ${({ theme }) => theme.spacing.lg});
    z-index: -1;
    background:
      radial-gradient(
        70rem 36rem at 108% -6%,
        color-mix(
          in srgb,
          ${({ theme }) => theme.colors.brand.primary} 16%,
          transparent
        ),
        transparent 62%
      ),
      radial-gradient(
        48rem 28rem at 88% 34%,
        color-mix(
          in srgb,
          ${({ theme }) => theme.colors.brand.primary} 7%,
          transparent
        ),
        transparent 70%
      ),
      ${({ theme }) => theme.colors.background.default};
    content: '';
  }
`

// Two wide cards per row so each page of four forms a clean 2x2 block.
// Single column on mobile; the explicit minmax track keeps cards full width
// with no overflow at 320px.
export const Grid = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const Pagination = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`

// 44px circular page controls, matching the Projects index.
export const PageButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.mode === 'dark'
          ? theme.colors.brand.primary
          : theme.colors.brand.navy
        : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ $active, theme }) =>
    $active
      ? theme.mode === 'dark'
        ? theme.colors.brand.primary
        : theme.colors.brand.navy
      : theme.colors.surface.default};
  color: ${({ $active, theme }) =>
    $active
      ? theme.mode === 'dark'
        ? theme.colors.brand.navy
        : theme.colors.brand.white
      : theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ $active, theme }) =>
      $active
        ? theme.mode === 'dark'
          ? theme.colors.brand.navy
          : theme.colors.brand.white
        : theme.colors.text.accent};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`
