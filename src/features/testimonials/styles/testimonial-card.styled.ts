import { Quote } from 'lucide-react'
import styled, { css } from 'styled-components'

export const Card = styled.li<{ $layout: 'marquee' | 'grid' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
  scroll-snap-align: start;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  ${({ $layout }) =>
    $layout === 'marquee'
      ? css`
          flex: none;
          width: clamp(18rem, 32vw, 22rem);
          padding: ${({ theme }) => theme.spacing.xl};
          border-radius: ${({ theme }) => theme.radii.lg};
        `
      : css`
          align-self: stretch;
          min-width: 0;
          height: 100%;
          padding: ${({ theme }) => theme.spacing.lg};
        `}

  &:hover {
    z-index: 1;
    border-color: ${({ theme }) => theme.colors.text.accent};
  }
`

// Rating on the left, decorative quote glyph on the right; the empty span keeps
// the glyph flush right when a card has no rating.
export const Top = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 1.5rem;
`

export const Rating = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RatingValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-variant-numeric: tabular-nums;
`

// Faint quote glyph in the top row, purely decorative depth.
export const QuoteMark = styled(Quote)`
  flex: none;
  color: ${({ theme }) => theme.colors.text.accent};
  opacity: 0.22;
  pointer-events: none;
`

export const Stars = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  color: ${({ theme }) => theme.colors.text.accent};
`

// Clamped by default; `$expanded` removes the clamp so "Read more" can grow the card.
// `min-width: 0` plus break-word wrapping keeps long quotes inside 320px cards.
export const Quotation = styled.blockquote<{ $expanded: boolean }>`
  margin: 0;
  min-width: 0;
  overflow-wrap: break-word;
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
`

export const ReadMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: ${({ theme }) => theme.colors.text.accent};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.brand.deep};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  svg {
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover svg {
      transform: translateX(2px);
    }
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
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }
`

export const AuthorRole = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }
`
