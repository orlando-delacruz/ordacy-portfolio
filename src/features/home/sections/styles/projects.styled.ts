import styled, { css, keyframes } from 'styled-components'
import { SecondaryButton } from '../../components/styles/buttons.styled'

export {
  PrimaryAnchor,
  SecondaryButton,
} from '../../components/styles/buttons.styled'

/*
 * Motion: the first time the carousel is seen (data-revealed, see Projects.tsx)
 * the cards fan out from the centre. The active card slowly zooms its photo,
 * a light sweeps across it, and its title, summary and buttons rise in each
 * time it becomes active. Behind the stage a glow pulses, rings turn and small
 * icon tiles float. Durations are choreography-specific, so they don't use
 * theme.transitions. Reduced motion shows the final, still state.
 */
const noMotionPref = '@media (prefers-reduced-motion: no-preference)'

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const shineSweep = keyframes`
  0% {
    transform: translateX(-150%) skewX(-20deg);
  }
  25%, 100% {
    transform: translateX(350%) skewX(-20deg);
  }
`

const glowPulse = keyframes`
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.08);
  }
`

const spin = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`

const bob = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(var(--tilt));
  }
  50% {
    transform: translateY(-8px) rotate(var(--tilt));
  }
`

/* ---------- 3D looping carousel ---------- */

export const Carousel = styled.div`
  position: relative;
  isolation: isolate;
  border-radius: ${({ theme }) => theme.radii.lg};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 4px;
  }
`

/* ---------- Decorative backdrop (aria-hidden, behind the stage) ---------- */

export const Decor = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`

// Soft brand light pooled behind the active card.
export const Glow = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(36rem, 90%);
  height: 26rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: radial-gradient(
    closest-side,
    ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.brand.primary} 22%, transparent)`},
    transparent
  );
  transform: translate(-50%, -50%);

  ${noMotionPref} {
    animation: ${glowPulse} 7s ease-in-out infinite;
  }
`

// Concentric rings centred on the stage; the small dashed one turns.
export const Ring = styled.span<{ $size: 'large' | 'small' }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $size }) => ($size === 'large' ? '38rem' : '26rem')};
  aspect-ratio: 1;
  border: 1px ${({ $size }) => ($size === 'large' ? 'solid' : 'dashed')}
    ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  transform: translate(-50%, -50%);

  ${noMotionPref} {
    animation: ${spin} ${({ $size }) => ($size === 'large' ? '90s' : '50s')}
      linear infinite ${({ $size }) => ($size === 'large' ? 'normal' : 'reverse')};
  }
`

const iconSpots = {
  topLeft: css`
    --tilt: -8deg;
    top: 8%;
    left: 4%;
  `,
  topRight: css`
    --tilt: 6deg;
    top: 14%;
    right: 5%;
  `,
  bottomLeft: css`
    --tilt: 10deg;
    bottom: 22%;
    left: 9%;
  `,
} as const

// Small floating tiles with build-related icons. Desktop only (phones are too narrow).
export const FloatingIcon = styled.span<{ $spot: keyof typeof iconSpots }>`
  position: absolute;
  display: none;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ theme }) => theme.shadows.md};
  color: ${({ theme }) => theme.colors.text.accent};
  transform: rotate(var(--tilt));
  ${({ $spot }) => iconSpots[$spot]}

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
  }

  ${noMotionPref} {
    animation: ${bob} ${({ $spot }) => ($spot === 'topRight' ? '7s' : '5.5s')}
      ease-in-out ${({ $spot }) => ($spot === 'bottomLeft' ? '-2s' : '0s')}
      infinite;
  }
`

// All slides share one grid cell, so the stage is as tall as the tallest card.
// Edges fade out so the curving side cards dissolve instead of being cut off.
export const Stage = styled.div`
  display: grid;
  overflow: hidden;
  padding-block: ${({ theme }) => theme.spacing.lg};
  perspective: 1600px;
  touch-action: pan-y;
  user-select: none;
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 4%,
    #000 96%,
    transparent
  );
`

/*
 * Cylinder layout: the active card faces the viewer; each step out slides
 * further, sinks back (translateZ) and turns away (rotateY), like the rim of a
 * wheel seen from the side. `spreads` are the horizontal positions (% of card
 * width) for |offset| 1 and 2; anything further out is hidden.
 */
const slideTransform = (
  offset: number,
  spreads: readonly [number, number],
  depth: number,
  angle: number,
) => {
  const distance = Math.abs(offset)
  const x =
    distance === 0
      ? 0
      : Math.sign(offset) *
        (distance === 1
          ? spreads[0]
          : spreads[1] + (distance - 2) * (spreads[1] - spreads[0]))
  // Outer cards turn 1.5x the base angle (not 2x) so they stay readable, not edge-on.
  const turn = distance <= 1 ? offset * angle : Math.sign(offset) * angle * 1.5
  return `translateX(${x}%) translateZ(${-distance * depth}px) rotateY(${turn}deg)`
}

export const Slide = styled.div<{ $offset: number; $instant: boolean }>`
  position: relative;
  grid-area: 1 / 1;
  justify-self: center;
  width: min(58%, 22rem);
  z-index: ${({ $offset }) => 10 - Math.abs($offset)};
  /* Mobile/tablet: three whole cards (centre + one each side). */
  opacity: ${({ $offset }) => (Math.abs($offset) <= 1 ? 1 : 0)};
  pointer-events: ${({ $offset }) => (Math.abs($offset) <= 1 ? 'auto' : 'none')};
  cursor: ${({ $offset }) => ($offset === 0 ? 'auto' : 'pointer')};
  /* Steep tilt turns the side cards into narrow panels so the centre card can be wide. */
  transform: ${({ $offset }) => slideTransform($offset, [76, 152], 120, 66)};
  transition: ${({ $instant, theme }) =>
    $instant
      ? 'none'
      : `transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${theme.transitions.slow}`};

  /* Desktop: five square cards, centre plus two on each side. */
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: min(28%, 19rem);
    opacity: ${({ $offset }) => (Math.abs($offset) <= 2 ? 1 : 0)};
    pointer-events: ${({ $offset }) => (Math.abs($offset) <= 2 ? 'auto' : 'none')};
    transform: ${({ $offset }) => slideTransform($offset, [104, 190], 110, 30)};
  }

  /* Side cards dim more the further out they sit, so the centre card reads first. */
  &::after {
    position: absolute;
    inset: 0;
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.brand.navy};
    content: '';
    opacity: ${({ $offset }) =>
      $offset === 0 ? 0 : Math.abs($offset) === 1 ? 0.3 : 0.5};
    pointer-events: none;
    transition: opacity ${({ theme }) => theme.transitions.slow};
  }

  /* Before the carousel is revealed, every card waits stacked at the centre;
     the normal transform transition then fans them out to their places. */
  ${noMotionPref} {
    ${Carousel}:not([data-revealed]) & {
      opacity: 0;
      transform: translateZ(-240px) scale(0.85);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }
`

/*
 * Image-led card: the photo fills the card and the text sits on a navy scrim
 * at the bottom. Taller portrait (3:5) on phones so the badge, two-line
 * summary and one-row actions fit; square on desktop. Brand tokens are
 * identical in both themes, so the overlay reads the same in light and
 * dark mode.
 */
// data-active (set in Projects.tsx) lets the image, shine and overlay react to the active card.
export const Card = styled.article`
  /* Card contents size themselves to the card's own width (container queries). */
  container-type: inline-size;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /* Taller portrait on mobile/tablet, square on desktop. */
  aspect-ratio: 3 / 5;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.brand.navy};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    aspect-ratio: 1;
  }
`

export const CardImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  /* Slow "Ken Burns" zoom while the card is active; eases back when it leaves. */
  ${noMotionPref} {
    transition: transform 1.2s ease-out;

    ${Card}[data-active] & {
      transform: scale(1.08);
      transition: transform 8s ease-out;
    }
  }
`

// Diagonal light that sweeps across the active card every few seconds.
export const Shine = styled.span`
  position: absolute;
  inset: 0 auto 0 0;
  width: 35%;
  background: linear-gradient(
    to right,
    transparent,
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.white} 18%, transparent),
    transparent
  );
  transform: translateX(-150%) skewX(-20deg);
  pointer-events: none;

  ${noMotionPref} {
    ${Card}[data-active] & {
      animation: ${shineSweep} 6s ease-in-out 400ms infinite;
    }
  }
`

export const Scrim = styled.span`
  position: absolute;
  inset: 0;
  /* Darker wash behind the text so title/summary stay readable on bright photos. */
  background: linear-gradient(
    to top,
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.navy} 96%, transparent) 0%,
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.navy} 88%, transparent) 38%,
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.navy} 60%, transparent) 62%,
    transparent 85%
  );
  pointer-events: none;
`

/*
 * Card content scales with the card's own width (cqi = 1% of it), so the same
 * card works at ~150px (three across on a phone) and ~300px (desktop centre).
 */

export const Overlay = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: clamp(
    ${({ theme }) => theme.spacing.sm},
    6cqi,
    ${({ theme }) => theme.spacing.lg}
  );
  color: ${({ theme }) => theme.colors.brand.white};

  /* Title, summary and buttons rise in each time the card becomes active. */
  ${noMotionPref} {
    ${Card}[data-active] & > * {
      animation: ${rise} 500ms ease-out backwards;
    }

    ${Card}[data-active] & > :nth-child(1) {
      animation-delay: 150ms;
    }

    ${Card}[data-active] & > :nth-child(2) {
      animation-delay: 250ms;
    }

    ${Card}[data-active] & > :nth-child(3) {
      animation-delay: 350ms;
    }
  }
`

export const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const Category = styled.span`
  --inset: clamp(
    ${({ theme }) => theme.spacing.sm},
    5cqi,
    ${({ theme }) => theme.spacing.md}
  );
  position: absolute;
  top: var(--inset);
  left: var(--inset);
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  max-width: calc(100% - 2 * var(--inset));
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: 0.08em;
  line-height: 1;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.white} 35%, transparent);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: linear-gradient(
    to right,
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.navy} 78%, transparent),
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.navy} 62%, transparent)
  );
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.28);
  color: ${({ theme }) => theme.colors.brand.white};
  font-size: clamp(
    calc(${({ theme }) => theme.typography.fontSizes.xs} * 0.85),
    4.5cqi,
    ${({ theme }) => theme.typography.fontSizes.xs}
  );
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Category icon in brand teal with a soft glow. */
  & > svg {
    flex: none;
    color: ${({ theme }) => theme.colors.brand.primary};
    filter: drop-shadow(0 0 4px ${({ theme }) => theme.colors.brand.primary});
  }

  /* Narrow cards: tighten tracking/padding so long labels fit instead of overflowing. */
  @container (max-width: 14rem) {
    gap: calc(${({ theme }) => theme.spacing.xs} / 2);
    padding: ${({ theme }) => theme.spacing.xs};
    letter-spacing: 0.04em;

    & > svg {
      width: 10px;
      height: 10px;
    }
  }
`

export const CategoryLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.white};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes.sm},
    7cqi,
    ${({ theme }) => theme.typography.fontSizes.xl}
  );
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

// Two lines max; the full text lives in the Details dialog.
export const Summary = styled.p`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.white} 88%,
    transparent
  );
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`

// Always one row. Mobile-first: Visit stretches long while Details is
// icon-only; on desktop both share the width with full labels.
const actionHeight = 'clamp(2.25rem, 14cqi, 2.75rem)'

export const CardActions = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: clamp(${({ theme }) => theme.spacing.xs}, 3cqi, ${({ theme }) => theme.spacing.sm});
  width: 100%;
  margin-top: clamp(${({ theme }) => theme.spacing.xs}, 3cqi, ${({ theme }) => theme.spacing.sm});

  & > a {
    flex: 1;
    min-width: 0;
    min-height: ${actionHeight};
    padding-inline: clamp(${({ theme }) => theme.spacing.xs}, 4cqi, ${({ theme }) => theme.spacing.md});
    font-size: clamp(
      ${({ theme }) => theme.typography.fontSizes.xs},
      5cqi,
      ${({ theme }) => theme.typography.fontSizes.sm}
    );
  }

  & svg {
    flex: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    & > a,
    & > button {
      flex: 1 1 0;
    }
  }
`

// Short "Visit" label: desktop only (mobile shows the full "Visit Website").
export const VisitShort = styled.span`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: inline;
  }
`

// Full "Visit Website" label: mobile only.
export const VisitFull = styled.span`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

// "Details" text: desktop only (mobile shows the icon alone).
export const DetailsLabel = styled.span`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: inline;
  }
`

// Frosted button that stays legible on the dark card scrim in both themes.
// Mobile: icon-only square so Visit stretches long; desktop: icon + label.
export const DetailsButton = styled.button`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: ${actionHeight};
  min-height: ${actionHeight};
  padding: 0;
  white-space: nowrap;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.white} 35%, transparent);
  border-radius: ${({ theme }) => theme.radii.md};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.white} 12%,
    transparent
  );
  color: ${({ theme }) => theme.colors.brand.white};
  font-family: inherit;
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes.xs},
    5cqi,
    ${({ theme }) => theme.typography.fontSizes.sm}
  );
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.white} 22%,
      transparent
    );
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex: 1 1 0;
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`

// Details dialog action row: wraps to two rows and fills the width on narrow screens.
export const DetailActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing.sm};

  & > * {
    flex: 1 1 auto;
  }
`

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`

const roundControl = css`
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const ArrowButton = styled.button`
  ${roundControl}
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  /* Chevron nudges toward its direction on hover. */
  svg {
    transition: transform ${({ theme }) => theme.transitions.base};
  }

  ${noMotionPref} {
    &:first-child:hover svg {
      transform: translateX(-2px);
    }

    &:last-child:hover svg {
      transform: translateX(2px);
    }
  }
`

export const ViewAllArrow = styled.span`
  display: inline-grid;
  transition: transform ${({ theme }) => theme.transitions.base};
`

export const ViewAllButton = styled(SecondaryButton)`
  ${noMotionPref} {
    &:hover ${ViewAllArrow} {
      transform: translateX(3px);
    }
  }
`

export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`

/* ---------- Detail view (inside Lightbox) ---------- */

export const Detail = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
    align-items: start;
  }
`

export const DetailMedia = styled.div`
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const DetailGallery = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const DetailThumbs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`

export const DetailThumb = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  width: 6rem;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: 2px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.text.accent : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.subtle};
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  cursor: pointer;
  transition:
    opacity ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`

export const DetailCategory = styled.span`
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const DetailText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const FeatureHeading = styled.h3`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const FeatureList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`

export const FeatureIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.text.accent};
  color: ${({ theme }) => theme.colors.text.inverse};
`
