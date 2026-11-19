import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'

/*
 * Motion: the first time the footer is seen (data-revealed, see SiteFooter.tsx)
 * the columns rise in one by one. Each link shows a pointer on hover/focus:
 * its icon tints, the label slides over, and a chevron slides in. Durations are
 * choreography-specific, so they don't use theme.transitions. Reduced motion
 * shows the final, still state.
 */
const COLUMN_DELAY = 150

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

/* ---------- Top accent line ---------- */

// Quiet divider across the top; no motion.
export const TopLine = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.text.accent},
    ${({ theme }) => theme.colors.brand.primary} 40%,
    ${({ theme }) => theme.colors.border.default}
  );
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
  grid-template-areas: 'brand brand' 'explore pages';
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas: 'brand explore pages';
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

  ${LinkIcon}, ${LinkLabel}, ${LinkLabel}::after {
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

  &:focus-visible {
    border-radius: ${({ theme }) => theme.radii.sm};
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    ${LinkIcon}, ${LinkLabel}, ${LinkLabel}::after {
      transition: none;
    }

    &:hover ${LinkIcon}, &:focus-visible ${LinkIcon},
    &:hover ${LinkLabel}, &:focus-visible ${LinkLabel} {
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

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`
