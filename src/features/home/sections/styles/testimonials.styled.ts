import { Quote } from 'lucide-react'
import styled, { keyframes } from 'styled-components'

export { SecondaryButton } from '@/components/ui/styles/buttons.styled'

/* ---------- Infinite horizontal marquee ---------- */

// Edges fade so cards dissolve at the row boundary instead of being cut off.
export const Viewport = styled.div`
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 4%,
    #000 96%,
    transparent
  );
`

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

// Renders two copies of the list back to back; animating to -50% loops seamlessly.
// Cards stretch to equal height (tallest in the row wins).
export const Track = styled.div<{ $duration: number; $paused: boolean }>`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.lg};
  width: max-content;
  padding-block: ${({ theme }) => theme.spacing.sm};
  animation: ${scroll} ${({ $duration }) => $duration}s linear infinite;
  animation-play-state: ${({ $paused }) => ($paused ? 'paused' : 'running')};

  &:hover,
  &:focus-within {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    overflow-x: auto;
    scroll-snap-type: x proximity;
  }
`

export const Card = styled.li`
  position: relative;
  display: flex;
  flex: none;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: clamp(18rem, 32vw, 22rem);
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  scroll-snap-align: start;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.base};

  &:hover {
    z-index: 1;
    border-color: ${({ theme }) => theme.colors.text.accent};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

// Oversized faint quote glyph in the corner, purely decorative depth.
export const QuoteMark = styled(Quote)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.accent};
  opacity: 0.1;
  pointer-events: none;
`

export const Stars = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  color: ${({ theme }) => theme.colors.text.accent};
`

// Clamped by default; `$expanded` removes the clamp so "Read more" can grow the card.
export const Quotation = styled.blockquote<{ $expanded: boolean }>`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};

  ${({ $expanded }) =>
    !$expanded &&
    `
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  `}

  &::before {
    content: '\\201C';
  }

  &::after {
    content: '\\201D';
  }
`

export const ReadMoreButton = styled.button`
  align-self: flex-start;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: ${({ theme }) => theme.colors.text.accent};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const Author = styled.figcaption`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Avatar = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.text.accent} 14%, ${theme.colors.surface.default})`};
  box-shadow: inset 0 0 0 1px
    ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.text.accent} 30%, transparent)`};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.02em;
`

export const AuthorInfo = styled.div`
  display: grid;
  gap: 0.125rem;
  min-width: 0;
`

export const AuthorName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const AuthorRole = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-overflow: ellipsis;
  white-space: nowrap;
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`

// Icon-only pause/resume toggle docked in the section header.
export const ScrollToggle = styled.button`
  display: grid;
  flex: none;
  place-items: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
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
`
