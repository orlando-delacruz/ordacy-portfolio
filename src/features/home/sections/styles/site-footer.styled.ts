import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'

/*
 * Motion: the first time the footer is seen (data-revealed, see SiteFooter.tsx)
 * the top accent line draws across, then the columns rise in one by one. Each
 * link shows a pointer on hover/focus: its icon tints and nudges, the label
 * slides over, and a chevron slides in. Durations are choreography-specific,
 * so they don't use theme.transitions. Reduced motion shows the final, still state.
 */
const COLUMN_DELAY = 150

const lineDraw = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`

const shimmer = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(400%);
  }
`

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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const arrowBob = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`

export const Footer = styled.footer`
  position: relative;
  padding-block: ${({ theme }) => theme.spacing['2xl']}
    ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  isolation: isolate;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-bottom: ${({ theme }) => theme.spacing.xl};
  }
`

/* ---------- Decorative shapes (aria-hidden, behind the content) ---------- */

export const Decor = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${Footer}[data-revealed] & {
      opacity: 1;
      animation: ${fadeIn} 1200ms ease-out backwards;
    }
  }
`

export const Ring = styled.span`
  position: absolute;
  top: -7rem;
  right: -5rem;
  width: 18rem;
  height: 18rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};

  /* Second, inner ring. */
  &::after {
    position: absolute;
    inset: 3rem;
    border: 1px dashed ${({ theme }) => theme.colors.border.default};
    border-radius: inherit;
    content: '';
  }
`

export const DotGrid = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  width: 7rem;
  height: 4.5rem;
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.border.default} 1.5px,
    transparent 1.5px
  );
  background-size: 0.875rem 0.875rem;
  mask-image: linear-gradient(to bottom left, black, transparent 85%);
`

// Oversized outlined brand name sitting along the bottom edge.
export const Watermark = styled.span`
  position: absolute;
  right: -0.04em;
  bottom: -0.22em;
  color: transparent;
  font-size: clamp(5rem, 20vw, 13rem);
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: -0.05em;
  line-height: 1;
  white-space: nowrap;
  -webkit-text-stroke: 1px ${({ theme }) => theme.colors.border.default};
  user-select: none;
`

// Accent line across the top: draws in from the left, then a highlight glides along it.
export const TopLine = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.text.accent},
    ${({ theme }) => theme.colors.brand.primary} 40%,
    ${({ theme }) => theme.colors.border.default}
  );
  transform-origin: left;

  &::after {
    position: absolute;
    inset: 0;
    width: 25%;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.surface.default},
      transparent
    );
    opacity: 0;
    content: '';
  }

  @media (prefers-reduced-motion: no-preference) {
    transform: scaleX(0);

    ${Footer}[data-revealed] & {
      transform: scaleX(1);
      animation: ${lineDraw} 900ms cubic-bezier(0.65, 0, 0.35, 1) backwards;
    }

    ${Footer}[data-revealed] &::after {
      opacity: 0.8;
      animation: ${shimmer} 3.5s ease-in-out 1200ms infinite backwards;
    }
  }
`

/* ---------- Columns ---------- */

// Columns rise in one after another once revealed.
const revealColumn = css<{ $index: number }>`
  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${Footer}[data-revealed] & {
      opacity: 1;
      animation: ${rise} 600ms ease-out
        ${({ $index }) => 250 + $index * COLUMN_DELAY}ms backwards;
    }
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-areas: 'brand brand' 'explore company';
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas: 'brand explore company';
    column-gap: ${({ theme }) => theme.spacing['2xl']};
  }
`

export const Brand = styled.div<{ $index: number }>`
  display: grid;
  grid-area: brand;
  gap: ${({ theme }) => theme.spacing.md};
  align-content: start;
  ${revealColumn}
`

export const BrandRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Tagline = styled.p`
  max-width: 40ch;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const NavGroup = styled.nav<{ $area: string; $index: number }>`
  display: grid;
  grid-area: ${({ $area }) => $area};
  gap: ${({ theme }) => theme.spacing.md};
  align-content: start;
  ${revealColumn}
`

export const GroupTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const GroupIcon = styled.span`
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const LinkList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const LinkIcon = styled.span`
  display: inline-grid;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.7;
`

export const LinkLabel = styled.span`
  position: relative;

  /* Underline that grows from the left on hover. */
  &::after {
    position: absolute;
    right: 0;
    bottom: -2px;
    left: 0;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    content: '';
  }
`

export const LinkPointer = styled.span`
  display: inline-grid;
  color: ${({ theme }) => theme.colors.text.accent};
  opacity: 0;
  transform: translateX(-0.375rem);
`

export const FooterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-block: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  ${LinkIcon}, ${LinkLabel}, ${LinkLabel}::after, ${LinkPointer} {
    transition:
      color ${({ theme }) => theme.transitions.base},
      opacity ${({ theme }) => theme.transitions.base},
      transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:hover ${LinkIcon}, &:focus-visible ${LinkIcon} {
    color: ${({ theme }) => theme.colors.text.accent};
    opacity: 1;
    transform: scale(1.12) rotate(-6deg);
  }

  &:hover ${LinkLabel}, &:focus-visible ${LinkLabel} {
    transform: translateX(2px);
  }

  &:hover ${LinkLabel}::after, &:focus-visible ${LinkLabel}::after {
    transform: scaleX(1);
  }

  &:hover ${LinkPointer}, &:focus-visible ${LinkPointer} {
    opacity: 1;
    transform: translateX(0);
  }

  &:focus-visible {
    border-radius: ${({ theme }) => theme.radii.sm};
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    ${LinkIcon}, ${LinkLabel}, ${LinkLabel}::after, ${LinkPointer} {
      transition: none;
    }

    &:hover ${LinkIcon}, &:focus-visible ${LinkIcon},
    &:hover ${LinkLabel}, &:focus-visible ${LinkLabel},
    &:hover ${LinkPointer}, &:focus-visible ${LinkPointer} {
      transform: none;
    }
  }
`

/* ---------- Bottom row ---------- */

export const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Copyright = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const BackToTopIcon = styled.span`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
  transition:
    background ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};
`

export const BackToTop = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:hover ${BackToTopIcon} {
    background: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.background.default};
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover ${BackToTopIcon} svg {
      animation: ${arrowBob} 800ms ease-in-out infinite;
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`
