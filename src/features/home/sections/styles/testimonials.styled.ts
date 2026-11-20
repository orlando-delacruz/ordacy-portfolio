import styled, { keyframes } from 'styled-components'

export { PrimaryButton } from '@/components/ui/styles/buttons.styled'

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
