import styled from 'styled-components'
import {
  Identity,
  Role,
  Stats,
} from '@/components/ui/styles/profile-hero.styled'

export const RoleGroup = styled.div`
  display: grid;
  grid-area: role;
  gap: ${({ theme }) => theme.spacing.xs};
  align-content: start;
  min-width: 0;
`

export const StripName = styled.p`
  margin: 0;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: 0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`

/* Phones: keep the role below the name on one line by letting it scale down
   faster than the name. */
export const StripRole = styled(Role)`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: clamp(0.625rem, 3.25vw, 0.875rem);
    white-space: nowrap;
  }
`

// Icon-only back action, matching the homepage like-button shape.
export const BackButton = styled.button`
  display: inline-grid;
  place-items: center;

  /* && beats Actions' “& > *” flex rules so the button stays 44px square. */
  && {
    flex: 0 0 auto;
  }

  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    transform 160ms ease;

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

// Tablet and mid-size desktops: the portrait and name/role share the first
// row, the facts span the full width below it, and the contact actions sit
// last. The single row returns at xl, where two actions still leave the facts
// enough room.
//
// xl and up: the original single row — portrait, name/role plus facts,
// contact actions.
export const ProfileStrip = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    'avatar role'
    'facts facts'
    'actions actions';
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding-block: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};

  ${Identity} {
    display: contents;
  }

  ${Stats} {
    grid-area: facts;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: 'avatar identity actions';
    gap: ${({ theme }) => theme.spacing.lg};

    ${Identity} {
      display: grid;
      grid-area: identity;
      gap: 0.75rem;
    }

    ${RoleGroup},
    ${Stats} {
      grid-area: auto;
    }
  }
`
