import { Quote } from 'lucide-react'
import styled, { css } from 'styled-components'

export const Card = styled.li<{ $layout: 'marquee' | 'grid' }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  scroll-snap-align: start;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  ${({ $layout }) =>
    $layout === 'marquee'
      ? css`
          flex: none;
          width: clamp(18rem, 32vw, 22rem);
        `
      : css`
          min-width: 0;
        `}

  &:hover {
    z-index: 1;
    border-color: ${({ theme }) => theme.colors.text.accent};
  }
`

// Small pill marking illustrative cards; never shown on real testimonials.
export const SampleBadge = styled.span`
  align-self: flex-start;
  padding: 0.125rem 0.625rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
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
