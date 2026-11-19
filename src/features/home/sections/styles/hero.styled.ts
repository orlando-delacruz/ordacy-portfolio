import styled, { css, keyframes } from 'styled-components'

export * from '@/components/ui/styles/profile-hero.styled'

const likePop = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  35% {
    transform: scale(1.28) rotate(-8deg);
  }
  65% {
    transform: scale(0.92) rotate(4deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`

// Owner-approved presence loop: one expanding halo per cycle.
const presencePing = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.45;
  }
  70%,
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`

// Compact icon-only like toggle in the hero actions row.
export const LikeButton = styled.button<{ $liked: boolean }>`
  display: inline-grid;
  place-items: center;
  /* && beats Actions' "& > *" flex-grow so the button stays square. */
  && {
    flex: 0 0 auto;
  }
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid
    ${({ $liked, theme }) =>
      $liked ? theme.colors.text.accent : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ $liked, theme }) =>
    $liked ? theme.colors.text.accent : theme.colors.text.primary};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    transform 160ms ease;

  svg {
    fill: transparent;
    transition: fill 220ms ease;
  }

  ${({ $liked }) =>
    $liked &&
    css`
      svg {
        fill: currentColor;
      }
    `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:active {
      transform: none;
    }
  }
`

// Wrapper keyed by click so the pop animation restarts each time.
export const LikeIcon = styled.span<{ $pulse: boolean }>`
  display: grid;
  place-items: center;
  transform-origin: center;

  ${({ $pulse }) =>
    $pulse &&
    css`
      animation: ${likePop} 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

// Home-only presence indicator on the brand avatar.
export const OnlineDot = styled.span`
  position: absolute;
  top: 85.36%;
  left: 85.36%;
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid ${({ theme }) => theme.colors.surface.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: #22c55e;
  pointer-events: none;
  transform: translate(-50%, -50%);
`

export const OnlinePulse = styled.span`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #22c55e;
  opacity: 0.35;
  transform-origin: center;
  animation: ${presencePing} 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
