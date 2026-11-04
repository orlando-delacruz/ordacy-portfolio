import styled, { css } from 'styled-components'

export {
  PrimaryAnchor,
  SecondaryButton,
} from '../../components/styles/buttons.styled'

/* ---------- 3D looping carousel ---------- */

export const Carousel = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 4px;
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
  width: min(38%, 20rem);
  z-index: ${({ $offset }) => 10 - Math.abs($offset)};
  /* Mobile/tablet: three whole cards (centre + one each side). */
  opacity: ${({ $offset }) => (Math.abs($offset) <= 1 ? 1 : 0)};
  pointer-events: ${({ $offset }) => (Math.abs($offset) <= 1 ? 'auto' : 'none')};
  cursor: ${({ $offset }) => ($offset === 0 ? 'auto' : 'pointer')};
  transform: ${({ $offset }) => slideTransform($offset, [106, 200], 160, 30)};
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

  @media (prefers-reduced-motion: reduce) {
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }
`

/*
 * Image-led card: the photo fills the card and the text sits on a navy scrim
 * at the bottom. Square on desktop, slightly taller (4:5) on phones so the
 * text still fits. Brand tokens are identical in both themes, so the overlay
 * reads the same in light and dark mode.
 */
export const Card = styled.article`
  /* Card contents size themselves to the card's own width (container queries). */
  container-type: inline-size;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  aspect-ratio: 4 / 5;
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
`

export const Scrim = styled.span`
  position: absolute;
  inset: 0;
  /* Dark only behind the text; the top half of the photo stays clear. */
  background: linear-gradient(
    to top,
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.navy} 92%, transparent) 0%,
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.navy} 65%, transparent) 30%,
    transparent 60%
  );
  pointer-events: none;
`

/*
 * Card content scales with the card's own width (cqi = 1% of it), so the same
 * card works at ~150px (three across on a phone) and ~300px (desktop centre).
 * Below WIDE_CARD the summary hides and button labels shorten.
 */
const WIDE_CARD = '15rem'

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
  max-width: calc(100% - 2 * var(--inset));
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.white} 30%, transparent);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.navy} 55%,
    transparent
  );
  color: ${({ theme }) => theme.colors.brand.white};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* Too cramped to read on narrow cards; the Details dialog still shows it. */
  @container (max-width: ${WIDE_CARD}) {
    display: none;
  }
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
    ${({ theme }) => theme.colors.brand.white} 78%,
    transparent
  );
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  @container (max-width: ${WIDE_CARD}) {
    display: none;
  }
`

// Always one row: the primary link stretches, Details stays compact.
const actionHeight = 'clamp(2.25rem, 14cqi, 2.75rem)'

export const CardActions = styled.div`
  display: flex;
  gap: clamp(${({ theme }) => theme.spacing.xs}, 3cqi, ${({ theme }) => theme.spacing.sm});
  width: 100%;
  margin-top: clamp(${({ theme }) => theme.spacing.xs}, 3cqi, ${({ theme }) => theme.spacing.sm});

  & > a {
    flex: 1;
    min-width: 0;
    min-height: ${actionHeight};
    padding-inline: clamp(${({ theme }) => theme.spacing.sm}, 5cqi, ${({ theme }) => theme.spacing.md});
    font-size: clamp(
      ${({ theme }) => theme.typography.fontSizes.xs},
      5cqi,
      ${({ theme }) => theme.typography.fontSizes.sm}
    );
  }
`

// Full label on wide cards, short label on narrow ones (only one is ever displayed).
export const LabelWide = styled.span`
  @container (max-width: ${WIDE_CARD}) {
    display: none;
  }
`

export const LabelNarrow = styled.span`
  display: none;

  @container (max-width: ${WIDE_CARD}) {
    display: inline-flex;
  }
`

// Frosted button that stays legible on the dark card scrim in both themes.
// Text on wide cards; icon-only square on narrow ones (accessible name via SrOnly).
export const DetailsButton = styled.button`
  /* Contains the visually hidden label text. */
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-width: ${actionHeight};
  min-height: ${actionHeight};
  padding: 0 ${({ theme }) => theme.spacing.md};

  @container (max-width: ${WIDE_CARD}) {
    padding: 0;
  }
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
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
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
`

// Lightbox action row: buttons wrap and fill the width on narrow screens.
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
`

export const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

// 24px hit area around a small visual dot; the active dot stretches into a pill.
export const Dot = styled.button<{ $active: boolean }>`
  display: grid;
  place-items: center;
  width: ${({ $active }) => ($active ? '2.25rem' : '1.5rem')};
  height: 1.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  transition: width ${({ theme }) => theme.transitions.base};

  &::before {
    width: 100%;
    max-width: ${({ $active }) => ($active ? '1.75rem' : '0.5rem')};
    height: 0.5rem;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ $active, theme }) =>
      $active ? theme.colors.text.accent : theme.colors.border.default};
    content: '';
    transition:
      max-width ${({ theme }) => theme.transitions.base},
      background ${({ theme }) => theme.transitions.base};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.pill};
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
