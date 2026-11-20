import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { PrimaryAction } from '@/components/ui/styles/buttons.styled'

export { SrOnly } from '@/features/home/sections/styles/projects.styled'

/* ---------- Hero: navy band with laptop visual ---------- */

export const Hero = styled.header`
  margin-top: calc(-1 * ${({ theme }) => theme.spacing.xl});
`

// Full-bleed photographic band: the art carries the navy field, dot grid,
// teal beams and rings, and the laptop on its pedestal, with the left side
// kept dark for the copy. Navy fallback while the art loads.
// The ::before veil keeps the copy readable over the artwork at every
// breakpoint; band content sits above it.
export const HeroBand = styled.div`
  position: relative;
  isolation: isolate;
  margin-inline: calc(-1 * ${({ theme }) => theme.spacing.lg});
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  background: #00243e url('/images/ordacy-hero-wave.png') no-repeat;
  background-size: cover;
  background-position: 44% center;

  &::before {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
    background: linear-gradient(
      to right,
      rgba(0, 36, 62, 0.9) 0%,
      rgba(0, 36, 62, 0.65) 48%,
      rgba(0, 36, 62, 0.45) 100%
    );
    content: '';
    pointer-events: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['2xl']}
      ${({ theme }) => theme.spacing.xl};
    border-bottom-left-radius: ${({ theme }) => theme.radii.md};
    border-bottom-right-radius: ${({ theme }) => theme.radii.md};
    background-position: right center;

    &::before {
      background: linear-gradient(
        to right,
        rgba(0, 36, 62, 0.9) 0%,
        rgba(0, 36, 62, 0.66) 42%,
        rgba(0, 36, 62, 0.22) 100%
      );
    }
  }
`

export const HeroGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  max-width: 70rem;
  margin-inline: auto;
`

export const HeroCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  justify-items: start;
  max-width: 36rem;
`

// Translucent teal pill over navy, matching the reference badge.
export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 45%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radii.pill};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.primary} 18%,
    transparent
  );
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const HeroTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.white};
  font-size: clamp(2rem, 5vw, 2.5rem);
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  text-wrap: balance;
`

export const HeroTitleAccent = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
`

export const HeroLead = styled.p`
  max-width: 34rem;
  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.white} 78%,
    transparent
  );
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};

  /* Full-width tap targets on phones; natural width once there is room. */
  & > * {
    flex: 1 1 12rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    & > * {
      flex: 0 0 auto;
    }
  }
`

// Ghost action for navy surfaces: transparent with a white outline.
export const HeroGhostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.white} 40%, transparent);
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.white};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-decoration: none;
  white-space: nowrap;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.white};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.white} 10%,
      transparent
    );
    color: ${({ theme }) => theme.colors.brand.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 3px;
  }
`

/* ---------- Index filters ---------- */

// Desktop filter panel: a labelled toolbar with the result summary and the
// expand toggle on top, and wrapping category chips underneath.
export const Filters = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const FilterTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const FilterLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;

  & > svg {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`

// Theme-adaptive active chip: navy ink on brand teal in light mode, white on
// dark teal in dark mode, matching PrimaryAction.
export const Chip = styled.button<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? 'transparent' : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $selected, theme }) =>
    $selected
      ? theme.mode === 'dark'
        ? '#007C6C'
        : theme.colors.brand.primary
      : theme.colors.background.subtle};
  color: ${({ $selected, theme }) =>
    $selected
      ? theme.mode === 'dark'
        ? '#ffffff'
        : theme.colors.brand.navy
      : theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ $selected, theme }) =>
      $selected ? 'transparent' : theme.colors.text.accent};
    background: ${({ $selected, theme }) =>
      $selected
        ? theme.mode === 'dark'
          ? '#006A5C'
          : theme.colors.brand.secondary
        : `color-mix(in srgb, ${theme.colors.text.accent} 6%, ${theme.colors.background.subtle})`};
    color: ${({ $selected, theme }) =>
      $selected
        ? theme.mode === 'dark'
          ? '#ffffff'
          : theme.colors.brand.navy
        : theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const ChipCount = styled.span`
  display: inline-grid;
  place-items: center;
  min-width: 1.25rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-variant-numeric: tabular-nums;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.5;
`

/* ---------- Grid ---------- */

export const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

/* ---------- Expand / Collapse icon toggle (lives in the filter rows) ---------- */

// Icon-only 48px box that toggles the carousel/index views. The label was
// removed by design, so the accessible name carries the action instead.
export const FilterToggle = styled(PrimaryAction)`
  flex: none;
  width: 3rem;
  height: 3rem;
  min-height: 3rem;
  padding: 0;
`

/* ---------- Mobile work view (below md; desktop keeps Filters + Grid) ---------- */

const viewIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const menuIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Keyed wrapper around the mobile/desktop work views so filter and page
// changes replay a short entrance. Motion is state change only.
export const View = styled.div`
  animation: ${viewIn} 200ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

// Rounded bar holding the two mobile filter segments; anchors the dropdown.
export const Segmented = styled.div`
  position: relative;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

// Left segment: teal filled (PrimaryAction look) when All is active,
// subtle (SecondaryAction look) otherwise.
export const SegmentAll = styled.button<{ $active: boolean }>`
  display: inline-flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  ${({ $active, theme }) =>
    $active
      ? `
          border: 1px solid transparent;
          background: ${
            theme.mode === 'dark' ? '#007C6C' : theme.colors.brand.primary
          };
          color: ${
            theme.mode === 'dark' ? '#ffffff' : theme.colors.brand.navy
          };
        `
      : `
          border: 1px solid ${theme.colors.border.default};
          background: ${theme.colors.background.subtle};
          color: ${theme.colors.text.primary};

          &:hover {
            border-color: ${theme.colors.text.accent};
            color: ${theme.colors.text.accent};
          }
        `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

// Right segment: subtle until a non-All filter is active, then accent
// border and text so the active state reads at a glance.
export const SegmentCategories = styled.button<{ $active: boolean }>`
  display: inline-flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.text.accent : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $active, theme }) =>
    $active
      ? `color-mix(in srgb, ${theme.colors.text.accent} 12%, ${theme.colors.surface.default})`
      : theme.colors.background.subtle};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text.accent : theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  & > svg:last-child {
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  &[aria-expanded='true'] > svg:last-child {
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    & > svg:last-child {
      transition: none;
    }
  }
`

// Absolute popover under the segmented bar with every filter option.
export const FilterMenu = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
  right: 0;
  left: 0;
  z-index: 10;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${menuIn} 150ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const FilterMenuItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  min-height: 2.75rem;
  padding: ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.text.accent : 'transparent'};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $selected, theme }) =>
    $selected
      ? `color-mix(in srgb, ${theme.colors.text.accent} 12%, ${theme.colors.surface.default})`
      : 'transparent'};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.text.accent : theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  text-align: left;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  & > :last-child {
    margin-left: auto;
  }
`

// Vertical stack of row cards for the current mobile page.
export const RowList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`

export const Pagination = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

// 44px circles; the current page is navy filled, the rest are subtle.
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
