import styled from 'styled-components'

/**
 * Mobile-only services carousel. From lg the ServiceExplorer split view takes
 * over, so the carousel hides itself and the page never shows two service lists.
 */

export const Carousel = styled.div`
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

export const Track = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  gap: 0.75rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`

/* Mint card with the copy on the left and a permissioned brand image on the right. */
export const Card = styled.article`
  display: grid;
  flex: 0 0 100%;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 25%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(
    135deg,
    color-mix(
        in srgb,
        ${({ theme }) => theme.colors.brand.primary} 18%,
        ${({ theme }) => theme.colors.surface.default}
      )
      0%,
    ${({ theme }) => theme.colors.surface.default} 70%
  );
  scroll-snap-align: center;

  /* Phones: stack the copy above a full-width visual. From sm the card uses
     the side-by-side composition with a taller visual. */
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: ${({ theme }) => theme.spacing.lg};
    min-height: 9.5rem;
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

export const Copy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const IconTile = styled.span`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.25;
`

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

export const Visual = styled.div`
  position: relative;
  min-height: 7rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: url('/images/ordacy-home-hero.png') right center / cover no-repeat;
  box-shadow: inset 0 0 0 1px
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.white} 35%,
      transparent
    );

  /* Fades the image edge into the mint card instead of a hard seam. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      color-mix(
          in srgb,
          ${({ theme }) => theme.colors.brand.primary} 22%,
          ${({ theme }) => theme.colors.surface.default}
        )
        0%,
      transparent 55%
    );
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 7.5rem;
  }
`

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: 0.75rem;
`

export const Dot = styled.button`
  display: grid;
  flex: none;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.round};
  background: transparent;
  cursor: pointer;

  span {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: ${({ theme }) => theme.radii.round};
    background: ${({ theme }) => theme.colors.text.secondary};
    transition: background ${({ theme }) => theme.transitions.fast};
  }

  &:hover span {
    background: ${({ theme }) => theme.colors.text.primary};
  }

  &[aria-current='true'] span {
    width: 0.75rem;
    height: 0.75rem;
    background: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`
