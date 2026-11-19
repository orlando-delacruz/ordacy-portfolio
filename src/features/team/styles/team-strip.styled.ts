import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Strip = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-inline: ${({ theme }) => theme.spacing.xl};
  }
`

export const StripLabel = styled.p`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

export const LabelIcon = styled.span`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 10%,
    transparent
  );
  color: ${({ theme }) => theme.colors.text.accent};
`

export const AvatarCluster = styled.ul`
  display: grid;
  width: 100%;
  max-width: 56rem;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    /* One column per card only when each card is wide enough for the full
       position; otherwise the cards stack instead of squeezing the chip. */
    grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }
`

export const AvatarItem = styled.li`
  display: flex;
  min-width: 0;
  container-type: inline-size;
`

export const AvatarLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  color: inherit;
  text-decoration: none;
  transition:
    border-color ${({ theme }) => theme.transitions.base},
    background ${({ theme }) => theme.transitions.base},
    transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.text.accent};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
    text-decoration: none;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      border-color ${({ theme }) => theme.transitions.fast},
      background ${({ theme }) => theme.transitions.fast};

    &:hover,
    &:focus-visible {
      box-shadow: none;
      transform: none;
    }
  }
`

export const FounderLink = styled(AvatarLink)`
  border-color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 35%,
    ${({ theme }) => theme.colors.border.default}
  );
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 8%,
    ${({ theme }) => theme.colors.surface.default}
  );

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.text.accent};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 12%,
      ${({ theme }) => theme.colors.surface.default}
    );
  }
`

export const AvatarFrame = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 6rem;
  height: 6rem;
  overflow: hidden;
  border: 4px solid ${({ theme }) => theme.colors.surface.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.text.accent};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: 0.02em;
  transition:
    transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 7rem;
    height: 7rem;
  }

  a:hover &,
  a:focus-visible & {
    transform: scale(1.04);
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.colors.text.accent},
      0 0 0 6px
        color-mix(
          in srgb,
          ${({ theme }) => theme.colors.text.accent} 16%,
          transparent
        );
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow ${({ theme }) => theme.transitions.fast};

    a:hover &,
    a:focus-visible & {
      transform: none;
    }
  }
`

export const AvatarImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const AvatarFallback = styled.span`
  line-height: 1;
`

// Monogram bookend: fills the right side of wide single-column cards without
// crowding the name and role on two-up or phone cards.
export const MemberInitials = styled.span`
  display: none;
  flex: none;
  place-items: center;
  width: 4rem;
  height: 4rem;
  margin-left: auto;
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 30%,
      ${({ theme }) => theme.colors.border.default}
    );
  border-radius: ${({ theme }) => theme.radii.round};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 8%,
    ${({ theme }) => theme.colors.surface.default}
  );
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: 0.02em;
  line-height: 1;

  @container (min-width: 40rem) {
    display: grid;
  }
`

export const MemberInfo = styled.span`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const MemberName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  transition: color ${({ theme }) => theme.transitions.fast};

  a:hover &,
  a:focus-visible & {
    color: ${({ theme }) => theme.colors.text.accent};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`

export const MemberRole = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: fit-content;
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &::before {
    flex-shrink: 0;
    width: 6px; /* grid-exempt: optical status dot */
    height: 6px; /* grid-exempt: optical status dot */
    border-radius: ${({ theme }) => theme.radii.round};
    background: ${({ theme }) => theme.colors.text.accent};
    content: '';
  }

  a:hover &,
  a:focus-visible & {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  /* Featured member: the chip carries the card's teal edge. */
  ${FounderLink} & {
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 35%,
      ${({ theme }) => theme.colors.border.default}
    );
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.6875rem;
  }
`

export const ViewProfile = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`
