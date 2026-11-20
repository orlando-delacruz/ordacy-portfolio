import styled, { css, keyframes } from 'styled-components'
import { PrimaryButton } from '@/components/ui/styles/buttons.styled'
import { fluidFont } from '@/styles/typography'

export {
  PrimaryAnchor,
  SecondaryButton,
} from '@/components/ui/styles/buttons.styled'

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

/* ---------- Image-led cards ---------- */

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

  /* Tablet: five cards (centre plus two each side), so the row fills the same
     content rail as the other sections instead of collapsing to a narrow fan. */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: min(36%, 20rem);
    opacity: ${({ $offset }) => (Math.abs($offset) <= 2 ? 1 : 0)};
    pointer-events: ${({ $offset }) => (Math.abs($offset) <= 2 ? 'auto' : 'none')};
    transform: ${({ $offset }) => slideTransform($offset, [104, 190], 110, 30)};
  }

  /* Desktop: five square cards (see Card), centre plus two on each side. */
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: min(28%, 19rem);
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
// data-active (carousel) drives the active-image zoom and overlay rise.
// Carousel cards are image-led with a navy scrim; grid cards are white
// editorial cards with the photo on top and the copy on white below.
export const Card = styled.article<{ $layout: 'carousel' | 'grid' | 'row' }>`
  /* Card contents size themselves to the card's own width (container queries). */
  container-type: inline-size;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};

  ${({ $layout, theme }) =>
    $layout === 'carousel'
      ? css`
          justify-content: flex-end;
          aspect-ratio: 3 / 5;
          background: ${theme.colors.brand.navy};
          box-shadow: ${theme.shadows.lg};

          @media (min-width: ${theme.breakpoints.lg}) {
            aspect-ratio: 1;
          }
        `
      : $layout === 'row'
        ? css`
            justify-content: flex-start;
            background: ${theme.colors.surface.default};
            box-shadow: ${theme.shadows.sm};
            transition:
              border-color ${theme.transitions.fast},
              box-shadow ${theme.transitions.fast};

            &:hover,
            &:focus-within {
              border-color: ${theme.colors.text.accent};
              box-shadow: ${theme.shadows.md};
            }
          `
        : css`
          justify-content: flex-start;
          background: ${theme.colors.surface.default};
          box-shadow: ${theme.shadows.sm};
          transition:
            border-color ${theme.transitions.fast},
            box-shadow ${theme.transitions.fast};

          &:hover,
          &:focus-within {
            border-color: ${theme.colors.text.accent};
            box-shadow: ${theme.shadows.md};
          }
        `}
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

/* ---------- Grid (white editorial) card pieces ---------- */

// Photo area of a grid card: the image fills it and the badges anchor to it.
export const GridMedia = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.brand.navy};
`

export const GridImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;

  ${noMotionPref} {
    transition: transform 600ms ease-out;

    ${Card}:hover &,
    ${Card}:focus-within & {
      transform: scale(1.04);
    }
  }
`

// White body below the photo: title, summary, then the action row.
export const GridBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const GridTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

// The two actions share the row equally; 44px tall with bold labels.
export const GridActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs};

  & > a,
  & > button {
    flex: 1 1 0;
    min-width: 0;
    min-height: 2.75rem;
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }

  & svg {
    flex: none;
  }
`

export const VisitArrow = styled.span`
  display: inline-grid;
`

// Light outline Details button for white cards (the frosted DetailsButton
// below is for the dark carousel overlay only). Icon-only on small cards so
// Visit keeps room; icon + label once the card is wide.
export const GridDetailsButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  white-space: nowrap;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const GridDetailsLabel = styled.span`
  display: none;

  @container (min-width: 20rem) {
    display: inline;
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

// Frosted pill shared by the category and concept badges.
const badgeBase = css`
  position: absolute;
  top: var(--inset);
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
  font-size: clamp(calc(0.75rem * 0.85), 4.5cqi, 0.75rem);
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
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
    letter-spacing: 0.04em;

    & > svg {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
`

export const Category = styled.span`
  --inset: clamp(
    ${({ theme }) => theme.spacing.sm},
    5cqi,
    ${({ theme }) => theme.spacing.md}
  );
  left: var(--inset);
  ${badgeBase}

  /* Concept-demo grid cards carry a Concept tag on the right, so the category
     yields room instead of running underneath it. */
  ${Card}[data-layout='grid'] & {
    max-width: calc(100% - 2 * var(--inset) - 5.5rem);
    font-size: calc(${({ theme }) => theme.typography.fontSizes.xs} * 0.92);
    letter-spacing: 0.02em;
  }

  /* Smaller cards get a smaller label so the longest category still fits. */
  @container (max-width: 22rem) {
    ${Card}[data-layout='grid'] & {
      font-size: ${fluidFont(0.625)};
    }
  }

  /* Phones drop the Concept tag on concept-demo cards, so the category can use
     the full width instead of truncating. */
  @container (max-width: 20.75rem) {
    ${Card}[data-layout='grid'] & {
      max-width: calc(100% - 2 * var(--inset));
    }
  }
`

// Concept-demo cards carry this tag so the concept-work label stays per card
// without squeezing the category into a truncated "Concept · ..." string.
export const ConceptTag = styled.span`
  --inset: clamp(
    ${({ theme }) => theme.spacing.sm},
    5cqi,
    ${({ theme }) => theme.spacing.md}
  );
  right: var(--inset);
  ${badgeBase}

  ${Card}[data-layout='grid'] & {
    font-size: calc(${({ theme }) => theme.typography.fontSizes.xs} * 0.92);
    letter-spacing: 0.06em;
  }

  @container (max-width: 22rem) {
    ${Card}[data-layout='grid'] & {
      padding-inline: ${({ theme }) => theme.spacing.sm};
      font-size: ${fluidFont(0.625)};
      letter-spacing: 0.04em;
    }
  }

  @container (max-width: 20.75rem) {
    ${Card}[data-layout='grid'] & {
      display: none;
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
  font-size: clamp(0.875rem, 7cqi, 1.25rem);
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
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
    font-size: clamp(0.75rem, 5cqi, 0.875rem);
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
  font-size: clamp(0.75rem, 5cqi, 0.875rem);
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

export const ViewAllButton = styled(PrimaryButton)``

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
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.text.accent};
  color: ${({ theme }) => theme.colors.text.inverse};
`

/* ---------- Row (horizontal) card pieces ---------- */

// Horizontal mobile-first card: square thumb on the left, copy on the right.
// Reuses the grid action row so touch targets stay 44px.
export const RowInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

export const RowThumb = styled.div`
  position: relative;
  display: block;
  flex: none;
  align-self: stretch;
  width: 7rem;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};

  & img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Narrow cards: slimmer thumb so the longest category pill fits uncut. */
  @container (max-width: 22rem) {
    width: 6.25rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 8.5rem;
  }

  ${noMotionPref} {
    & img {
      transition: transform 600ms ease-out;
    }

    ${Card}:hover & img,
    ${Card}:focus-within & img {
      transform: scale(1.04);
    }
  }
`

export const RowContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

// Mint pill: accent-tinted background with a plain (not uppercase) label.
export const RowCategory = styled.span`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  max-width: 100%;
  overflow: hidden;
  padding: 0.125rem ${({ theme }) => theme.spacing.sm};
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 14%,
    ${({ theme }) => theme.colors.surface.default}
  );
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};

  & > svg {
    flex: none;
    width: 0.75rem;
    height: 0.75rem;
  }

  /* Narrow cards: smaller pill text so the longest category fits uncut. */
  @container (max-width: 22rem) {
    padding-inline: ${({ theme }) => theme.spacing.sm};
    font-size: ${fluidFont(0.6875)};
  }
`

export const RowTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

