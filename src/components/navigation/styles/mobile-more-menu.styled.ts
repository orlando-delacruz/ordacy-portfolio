import { NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import styled, { keyframes } from 'styled-components'

const moreIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(1rem);
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

// Bottom sheet: a floating card pinned to the viewport bottom over a dimmed
// backdrop. The dialog itself is transparent so the whole visible sheet —
// card and all — follows the drag; only the inner card carries the surface.
// Entrance and backdrop fade are state change only.
export const Dialog = styled.dialog`
  position: fixed;
  inset: auto 0 0;
  width: 100%;
  max-width: 36rem;
  max-height: calc(100dvh - ${({ theme }) => theme.spacing['2xl']});
  margin: 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};

  &[open] {
    animation: ${moreIn} 200ms ease-out;
  }

  &[open]::backdrop {
    animation: ${fadeIn} 200ms ease-out;
  }

  // The dim follows the drag via --sheet-drag (0 at rest, 1 dismissed),
  // set from MobileMoreMenu as the sheet travels.
  &::backdrop {
    background: rgba(0, 36, 62, 0.55);
    opacity: calc(1 - var(--sheet-drag, 0));
  }

  &:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &[open],
    &[open]::backdrop {
      animation: none;
    }
  }
`

// Drag-handle cue centered above the header; doubles as the top of the
// drag zone, so it never scrolls and always grabs the gesture.
export const Grabber = styled.span`
  display: block;
  width: 2.5rem;
  height: 0.25rem;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.border.default};
  touch-action: none;
  cursor: grab;
`

export const Inner = styled.div`
  max-height: calc(100dvh - ${({ theme }) => theme.spacing['2xl']});
  padding:
    calc(env(safe-area-inset-top) + ${({ theme }) => theme.spacing.md})
    ${({ theme }) => theme.spacing.lg}
    calc(env(safe-area-inset-bottom) + ${({ theme }) => theme.spacing.xl});
  overflow: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
  border-radius: ${({ theme }) => theme.radii.lg}
    ${({ theme }) => theme.radii.lg} 0 0;
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 2.75rem;
  touch-action: none;
  cursor: grab;
`

export const Brand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
`

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  padding: 0;
  list-style: none;
`

export const Item = styled.li`
  min-width: 0;
`

// Tinted tile behind each row icon; turns solid teal on the active route.
export const ItemIcon = styled.span`
  display: grid;
  flex: none;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};
`

export const ItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 3.5rem;
  padding: ${({ theme }) => theme.spacing.sm};
  padding-right: ${({ theme }) => theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.default};
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &[aria-current='page'] {
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 35%,
      transparent
    );
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 8%,
      ${({ theme }) => theme.colors.surface.default}
    );
    color: ${({ theme }) => theme.colors.text.accent};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }

  &[aria-current='page'] ${ItemIcon} {
    background: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`

export const ItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Chevron = styled(ChevronRight)`
  flex-shrink: 0;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.7;
`
