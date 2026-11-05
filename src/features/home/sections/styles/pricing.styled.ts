import styled, { css, keyframes } from 'styled-components'
import { PrimaryButton } from '@/components/ui/styles/buttons.styled'

export {
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/styles/buttons.styled'

/*
 * Motion: the first time the section is seen (data-revealed on Stage, see
 * Pricing.tsx) cards rise in one by one and their checkmarks pop down the list.
 * The currency pill slides between options and prices flip in on each switch.
 * The featured card's border has a light circling it. Cards rise via
 * the `translate` property so it never clashes with the featured card's
 * `transform` lift. Durations are choreography-specific, so they don't use
 * theme.transitions. Reduced motion shows the final, still state.
 */
const noMotionPref = '@media (prefers-reduced-motion: no-preference)'

const cardRise = keyframes`
  from {
    opacity: 0;
    translate: 0 1.25rem;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
`

const checkPop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.4);
  }
  70% {
    opacity: 1;
    transform: scale(1.15);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

const priceFlip = keyframes`
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`

// Rotates the featured card's conic border light around its edge.
const borderSpin = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`

const glowPulse = keyframes`
  0%, 100% {
    opacity: 0.55;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.85;
    transform: translate(-50%, -50%) scale(1.08);
  }
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const sendFly = keyframes`
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(3px, -3px);
  }
`

// Wraps the whole section body; holds data-revealed and the background shapes.
export const Stage = styled.div`
  position: relative;
  isolation: isolate;
`

/* ---------- Decorative shapes (aria-hidden, behind the content) ---------- */

export const Decor = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
`

// Soft accent light pooled behind the middle (featured) card.
export const Glow = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(40rem, 90%);
  height: 28rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: radial-gradient(
    closest-side,
    ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.brand.primary} 18%, transparent)`},
    transparent
  );
  transform: translate(-50%, -50%);

  ${noMotionPref} {
    animation: ${glowPulse} 8s ease-in-out infinite;
  }
`

export const Dots = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 10rem;
  height: 6rem;
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.border.default} 1.5px,
    transparent 1.5px
  );
  background-size: 0.875rem 0.875rem;
  mask-image: linear-gradient(to bottom left, black, transparent 80%);
`

/* ---------- Currency toggle ---------- */

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`

// Two equal columns so the selected pill can slide exactly one option over.
export const Toggle = styled.div<{ $index: number }>`
  position: relative;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};

  &::before {
    position: absolute;
    top: ${({ theme }) => theme.spacing.xs};
    bottom: ${({ theme }) => theme.spacing.xs};
    left: ${({ theme }) => theme.spacing.xs};
    width: calc(50% - ${({ theme }) => theme.spacing.xs});
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.surface.default};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transform: translateX(${({ $index }) => $index * 100}%);
    content: '';
  }

  ${noMotionPref} {
    &::before {
      transition: transform 350ms cubic-bezier(0.34, 1.4, 0.64, 1);
    }
  }
`

export const ToggleOption = styled.button<{ $selected: boolean }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 2.5rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.lg};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: transparent;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.text.primary : theme.colors.text.secondary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

// The currency sign shown as the option's single icon, in a small round badge.
export const CurrencyGlyph = styled.span`
  display: grid;
  place-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: currentColor;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  line-height: 1;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1);

  [aria-pressed='true'] > & {
    background: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  ${noMotionPref} {
    [aria-pressed='true'] > & {
      transform: rotate(-12deg) scale(1.1);
    }
  }
`

/* ---------- Cards ---------- */

// Below lg: a swipeable row with snap points; the next card peeks in to hint at scrolling.
export const Grid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-block: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.lg};
  }

  & > * {
    flex: 0 0 min(85%, 22rem);
    scroll-snap-align: start;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    padding-block: 0;
    overflow: visible;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.lg};
    row-gap: 0;
  }
`

/*
 * Featured (Growth) card: a 2px gradient border on all four sides with a light
 * travelling around it (no outer shadow). Built from two layers: ::before
 * is an oversized rotating conic gradient, ::after a surface-colored panel inset
 * 2px, so only a 2px rim of the gradient shows. The real border is removed and
 * its 1px added back to the padding so the content still lines up with the
 * other cards. Content sits above both layers.
 */
const featuredStyles = css`
  border: 0;
  padding: calc(${({ theme }) => theme.spacing.lg} + 1px);
  box-shadow: none;

  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250%;
    aspect-ratio: 1;
    background: conic-gradient(
      from 0deg,
      ${({ theme }) => theme.colors.text.accent} 0deg,
      ${({ theme }) => theme.colors.text.accent} 200deg,
      ${({ theme }) => theme.colors.brand.primary} 260deg,
      ${({ theme }) => theme.colors.brand.white} 300deg,
      ${({ theme }) => theme.colors.brand.primary} 330deg,
      ${({ theme }) => theme.colors.text.accent} 360deg
    );
    transform: translate(-50%, -50%);
    content: '';
  }

  &::after {
    position: absolute;
    inset: 2px;
    border-radius: calc(${({ theme }) => theme.radii.lg} - 2px);
    background: ${({ theme }) => theme.colors.surface.default};
    content: '';
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  &:hover {
    box-shadow: none;
  }

  ${noMotionPref} {
    &::before {
      animation: ${borderSpin} 5s linear infinite;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: calc(${({ theme }) => theme.spacing.xl} + 1px);
  }
`

// Desktop: each card spans 5 shared rows (subgrid) so prices, lists and buttons line up across plans.
export const Card = styled.article<{ $featured: boolean; $index: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  transition:
    box-shadow ${({ theme }) => theme.transitions.slow},
    border-color ${({ theme }) => theme.transitions.slow};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${noMotionPref} {
    opacity: 0;
    transition:
      box-shadow ${({ theme }) => theme.transitions.slow},
      border-color ${({ theme }) => theme.transitions.slow},
      translate ${({ theme }) => theme.transitions.slow};

    ${Stage}[data-revealed] & {
      opacity: 1;
      animation: ${cardRise} 600ms ease-out ${({ $index }) => 150 + $index * 150}ms
        backwards;
    }

    &:hover {
      translate: 0 -4px;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-row: span 5;
    grid-template-rows: subgrid;
    row-gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    transform: ${({ $featured, theme }) =>
      $featured ? `translateY(-${theme.spacing.sm})` : 'none'};
  }

  /* Last, so its padding adjustment wins over the breakpoint padding above. */
  ${({ $featured }) => $featured && featuredStyles}
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

export const PlanIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.accent};
  transition: transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1);

  ${noMotionPref} {
    ${Card}:hover & {
      transform: rotate(-8deg) scale(1.08);
    }
  }
`

export const NameRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
`

export const PlanName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
`

export const Category = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface.subtle};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`

export const PriceBlock = styled.div`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const PriceLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`

export const Price = styled.p<{ $featured: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.125em;
  margin: 0;
  color: ${({ $featured, theme }) =>
    $featured ? theme.colors.text.accent : theme.colors.text.primary};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['2xl']},
    3vw,
    ${({ theme }) => theme.typography.fontSizes['3xl']}
  );
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};

  ${noMotionPref} {
    animation: ${priceFlip} 400ms ease-out;
  }
`

// Smaller, raised currency symbol (featured plan only).
export const Currency = styled.span`
  margin-top: 0.2em;
  font-size: 0.55em;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const PriceNote = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const Positioning = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const FitList = styled.ul`
  display: grid;
  flex: 1;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: ${({ theme }) => theme.spacing.lg} 0 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  list-style: none;
`

export const FitIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.text.accent};
  color: ${({ theme }) => theme.colors.text.inverse};
`

// Checkmarks pop down each list once its card has risen in.
export const FitItem = styled.li<{ $card: number; $index: number }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};

  ${noMotionPref} {
    ${Stage}[data-revealed] & ${FitIcon} {
      animation: ${checkPop} 400ms cubic-bezier(0.34, 1.56, 0.64, 1)
        ${({ $card, $index }) => 550 + $card * 150 + $index * 90}ms backwards;
    }
  }
`

export const CardAction = styled.div`
  display: grid;
  align-content: end;

  & > a {
    width: 100%;
  }
`

/* ---------- Help strip ---------- */

export const Help = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  isolation: isolate;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.background.subtle};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  }
`

// Dashed ring peeking in from the left edge, turning slowly.
export const HelpRing = styled.span`
  position: absolute;
  top: 50%;
  left: -3rem;
  z-index: -1;
  width: 9rem;
  height: 9rem;
  margin-top: -4.5rem;
  border: 1px dashed
    ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.text.accent} 35%, transparent)`};
  border-radius: ${({ theme }) => theme.radii.round};
  pointer-events: none;

  ${noMotionPref} {
    animation: ${spin} 40s linear infinite;
  }
`

export const HelpTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const HelpText = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

// The paper plane takes off on hover.
export const HelpButton = styled(PrimaryButton)`
  svg {
    transition: transform ${({ theme }) => theme.transitions.base};
  }

  ${noMotionPref} {
    &:hover svg {
      animation: ${sendFly} 700ms ease-in-out infinite;
    }
  }
`
