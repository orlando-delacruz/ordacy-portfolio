import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { baseStyles } from '@/components/ui/styles/buttons.styled'

/*
 * Motion: the first time the banner is seen (data-revealed, see FinalCta.tsx)
 * the background shapes drift in, then the "what happens next" steps light up
 * left to right with their pointers. Afterwards the pointers nudge forward on a
 * loop and a dot circles the large ring. Durations are choreography-specific,
 * so they don't use theme.transitions. Reduced motion shows the final, still state.
 */
const STEP_DELAY = 350
const stepDelay = (index: number, offset = 0) =>
  `${400 + index * STEP_DELAY + offset}ms`

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

const stepIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.95);
  }
  70% {
    opacity: 1;
    transform: translateY(-2px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const pointerIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const pointerNudge = keyframes`
  0%, 60%, 100% {
    transform: translateX(0);
  }
  30% {
    transform: translateX(3px);
  }
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const bob = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`

// The page's one full-color surface: brand teal with navy ink in both themes.
export const Banner = styled.section`
  position: relative;
  display: grid;
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
    align-items: end;
    column-gap: ${({ theme }) => theme.spacing['2xl']};
  }
`

/* ---------- Decorative shapes (aria-hidden, behind the content) ---------- */

export const Decor = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
`

// Shared by every shape: hidden until the banner is revealed, then drifts in.
const revealShape = (delay: number) => css`
  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${Banner}[data-revealed] & {
      opacity: 1;
      animation: ${shapeIn} 900ms ease-out ${delay}ms backwards;
    }
  }
`

// Soft white light pooling in the top-right corner.
export const Glow = styled.span`
  position: absolute;
  top: -10rem;
  right: -8rem;
  width: 28rem;
  height: 28rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: radial-gradient(
    closest-side,
    ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.brand.white} 45%, transparent)`},
    transparent
  );
  ${revealShape(0)}
`

const ringBase = css`
  position: absolute;
  border-radius: ${({ theme }) => theme.radii.round};
`

// Large and small rings share a center near the top-right corner.
export const RingLarge = styled.span`
  ${ringBase}
  top: -9rem;
  right: -7rem;
  width: 22rem;
  height: 22rem;
  border: 2px solid ${navyMix(14)};
  ${revealShape(100)}
`

export const RingSmall = styled.span`
  ${ringBase}
  top: -4rem;
  right: -2rem;
  width: 12rem;
  height: 12rem;
  border: 2px dashed ${navyMix(18)};
  ${revealShape(200)}

  @media (prefers-reduced-motion: no-preference) {
    ${Banner}[data-revealed] & {
      animation:
        ${shapeIn} 900ms ease-out 200ms backwards,
        ${spin} 40s linear 1100ms infinite reverse;
    }
  }
`

// Rotating frame matching RingLarge; carries a dot around its edge.
export const Orbit = styled.span`
  ${ringBase}
  top: -9rem;
  right: -7rem;
  width: 22rem;
  height: 22rem;
  ${revealShape(300)}

  @media (prefers-reduced-motion: no-preference) {
    ${Banner}[data-revealed] & {
      animation:
        ${shapeIn} 900ms ease-out 300ms backwards,
        ${spin} 18s linear 1200ms infinite;
    }
  }
`

export const OrbitDot = styled.span`
  position: absolute;
  /* On the circle at 45°: r − r/√2 − half the dot (r = 11rem). */
  bottom: 2.85rem;
  left: 2.85rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.brand.navy};
  box-shadow: 0 0 0 4px
    ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.brand.white} 50%, transparent)`};
`

// Dot pattern in the lower-left corner, fading toward the content.
export const DotGrid = styled.span`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.lg};
  left: ${({ theme }) => theme.spacing.lg};
  width: 9rem;
  height: 5rem;
  background-image: radial-gradient(${navyMix(22)} 1.5px, transparent 1.5px);
  background-size: 0.875rem 0.875rem;
  mask-image: linear-gradient(to top right, black, transparent 80%);
  ${revealShape(400)}

  @media (prefers-reduced-motion: no-preference) {
    ${Banner}[data-revealed] & {
      animation:
        ${shapeIn} 900ms ease-out 400ms backwards,
        ${bob} 6s ease-in-out 1300ms infinite;
    }
  }

  /* On phones it would sit under the buttons; keep it for roomier layouts. */
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: block;
  }
`

/* ---------- Content ---------- */

export const Copy = styled.div`
  display: grid;
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
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['2xl']},
    5vw,
    ${({ theme }) => theme.typography.fontSizes['4xl']}
  );
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

// "What happens next": three pills joined by chevron pointers.
export const Steps = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  padding: 0;
  list-style: none;
`

export const StepItem = styled.li<{ $index: number }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs};
  padding-right: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${navyMix(18)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${navyMix(6)};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  white-space: nowrap;

  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${Banner}[data-revealed] & {
      opacity: 1;
      animation: ${stepIn} 500ms ease-out ${({ $index }) => stepDelay($index)}
        backwards;
    }
  }
`

export const StepIcon = styled.span`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.brand.navy};
  color: ${({ theme }) => theme.colors.brand.white};
`

// Chevron between steps; slides in just before its step, then nudges forward on a loop.
export const Pointer = styled.li<{ $index: number }>`
  display: grid;
  place-items: center;
  color: ${navyMix(70)};

  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${Banner}[data-revealed] & {
      opacity: 1;
      animation: ${pointerIn} 350ms ease-out
        ${({ $index }) => stepDelay($index, -180)} backwards;
    }

    ${Banner}[data-revealed] & svg {
      animation: ${pointerNudge} 1.6s ease-in-out
        ${({ $index }) => stepDelay(3, $index * 200)} infinite;
    }
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  /* Full-width tap targets on phones; natural width once there is room. */
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

export const ButtonArrow = styled.span`
  display: inline-grid;
  transition: transform ${({ theme }) => theme.transitions.base};
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
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover ${ButtonArrow} {
      transform: translateX(3px);
    }
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
  }
`
