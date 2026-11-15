import styled from 'styled-components'

export * from '@/components/ui/styles/profile-hero.styled'

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
    transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

// Home-only presence indicator on the brand avatar.
export const OnlineDot = styled.span`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid ${({ theme }) => theme.colors.surface.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: #22c55e;
  pointer-events: none;
`

export const OnlinePulse = styled.span`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #22c55e;
  opacity: 0.35;
`
