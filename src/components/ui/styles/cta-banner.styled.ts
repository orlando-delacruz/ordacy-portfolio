import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { baseStyles } from '@/components/ui/styles/buttons.styled'

/*
 * Motion: the first time the banner is seen (data-revealed, see CtaBanner.tsx)
 * the ring eases in. Reduced motion shows the final, still state.
 */

const navyMix = (amount: number) =>
  css`color-mix(in srgb, ${({ theme }) => theme.colors.brand.navy} ${amount}%, transparent)`

const shapeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

// The page's one full-color surface: brand teal with navy ink in both themes.
export const Banner = styled.section`
  position: relative;
  display: grid;
  grid-template-areas:
    'copy'
    'actions';
  gap: ${({ theme }) => theme.spacing.xl};
  margin-block: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  isolation: isolate;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.brand.navy};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['3xl']};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: 'copy actions';
    align-items: end;
    column-gap: ${({ theme }) => theme.spacing['2xl']};
  }
`

/* ---------- Decorative shape (aria-hidden, behind the content) ---------- */

export const Decor = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
`

// Shared entrance: hidden until the banner is revealed, then eases in once.
const revealShape = (delay: number) => css`
  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${Banner}[data-revealed] & {
      opacity: 1;
      animation: ${shapeIn} 900ms ease-out ${delay}ms backwards;
    }
  }
`

// Single ring near the top-right corner.
export const RingLarge = styled.span`
  position: absolute;
  top: -9rem;
  right: -7rem;
  width: 22rem;
  height: 22rem;
  border: 2px solid ${navyMix(14)};
  border-radius: ${({ theme }) => theme.radii.round};
  ${revealShape(100)}
`

/* ---------- Content ---------- */

export const Copy = styled.div`
  display: grid;
  grid-area: copy;
  gap: ${({ theme }) => theme.spacing.md};
  justify-items: start;
`

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${navyMix(22)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.brand.white} 35%, transparent)`};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const Title = styled.h2`
  margin: 0;
  color: inherit;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: -0.03em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const Description = styled.p`
  max-width: 46ch;
  margin: 0;
  color: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.brand.navy} 85%, ${theme.colors.brand.primary})`};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Actions = styled.div`
  display: flex;
  grid-area: actions;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  /* Full-width tap targets on phones, natural width once there is room. */
  & > * {
    flex: 1 1 14rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    & > * {
      flex: 0 0 auto;
    }
  }
`

// The theme's focus color is teal, which disappears on this surface.
const navyFocus = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.navy};
    outline-offset: 3px;
  }
`

// Leading icons lift slightly on hover.
const iconLift = css`
  svg {
    transition: transform ${({ theme }) => theme.transitions.base};
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover > svg {
      transform: translateY(-2px) rotate(-8deg);
    }
  }
`

export const PrimaryButton = styled(Link)`
  ${baseStyles}
  ${navyFocus}
  ${iconLift}
  border: 1px solid ${({ theme }) => theme.colors.brand.navy};
  background: ${({ theme }) => theme.colors.brand.navy};
  color: ${({ theme }) => theme.colors.brand.white};

  &:hover {
    background: ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.brand.navy} 86%, ${theme.colors.brand.white})`};
    color: ${({ theme }) => theme.colors.brand.white};
  }
`

// Same primary look for in-page anchors such as the contact form target.
export const PrimaryAnchor = styled.a`
  ${baseStyles}
  ${navyFocus}
  ${iconLift}
  border: 1px solid ${({ theme }) => theme.colors.brand.navy};
  background: ${({ theme }) => theme.colors.brand.navy};
  color: ${({ theme }) => theme.colors.brand.white};

  &:hover {
    background: ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.brand.navy} 86%, ${theme.colors.brand.white})`};
    color: ${({ theme }) => theme.colors.brand.white};
  }
`

export const SecondaryButton = styled(Link)`
  ${baseStyles}
  ${navyFocus}
  ${iconLift}
  border: 1px solid ${navyMix(45)};
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.navy};

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.navy};
    background: ${navyMix(8)};
    color: ${({ theme }) => theme.colors.brand.navy};
  }
`

