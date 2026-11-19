import styled from 'styled-components'
import {
  Identity,
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

// Identity row under the team page hero.
//
// Phones: the portrait and name/role share the first row, the facts span the
// full width below it, and the contact action sits last. The shared Identity
// box is dissolved with `display: contents` so its children can take those
// rows.
//
// Tablet and up: the original single row — portrait, name/role plus facts,
// contact.
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

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
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
