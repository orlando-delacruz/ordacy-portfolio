import styled, { css, keyframes } from 'styled-components'
import { PrimaryButton, SecondaryButton } from '@/components/ui/styles/buttons.styled'

/*
 * Shared profile-hero layout: the homepage hero and the team member hero
 * use the same cover, avatar, identity, stats and actions.
 * Motion: on page load the avatar pops in and the name, stats and actions rise
 * after it. The cover art then keeps a slow ambient loop (rings, the bar
 * drifts, sparkles twinkle, mock cards bob, a light sweep crosses). Durations
 * are choreography-specific, so they don't use theme.transitions. Everything is
 * wrapped in prefers-reduced-motion: no-preference, so reduced motion is static.
 */
const noMotionPref = '@media (prefers-reduced-motion: no-preference)'

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  60% {
    opacity: 1;
    transform: scale(1.06);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

export const HeroSection = styled.section`
  margin-top: calc(-1 * ${({ theme }) => theme.spacing.xl});
  padding-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-bottom: ${({ theme }) => theme.spacing['3xl']};
  }
`

export const CoverBleed = styled.div`
  margin-inline: calc(-1 * ${({ theme }) => theme.spacing.lg});
`

export const CoverButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  cursor: pointer;
  text-align: inherit;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    border-bottom-left-radius: ${({ theme }) => theme.radii.md};
    border-bottom-right-radius: ${({ theme }) => theme.radii.md};
  }
`

export const Cover = styled.div`
  position: relative;
  min-height: 12rem;
  overflow: hidden;
  background: #00243e;
  background-image: radial-gradient(
    rgba(254, 254, 254, 0.14) 1px,
    transparent 1.5px
  );
  background-size: 1.5rem 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 17rem;
    border-bottom-left-radius: ${({ theme }) => theme.radii.md};
    border-bottom-right-radius: ${({ theme }) => theme.radii.md};
  }
`

export const CoverRingLarge = styled.span`
  position: absolute;
  top: -6rem;
  right: -4rem;
  width: 18rem;
  height: 18rem;
  border: 3px solid rgba(0, 218, 185, 0.35);
  border-radius: ${({ theme }) => theme.radii.round};
  pointer-events: none;
`

// Large translucent monogram for member covers.
export const CoverMonogram = styled.span`
  position: absolute;
  top: 50%;
  right: 8%;
  color: rgba(254, 254, 254, 0.16);
  font-size: clamp(5rem, 18vw, 10rem);
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: 0.02em;
  line-height: 1;
  transform: translateY(-50%);
  pointer-events: none;
  user-select: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    right: 12%;
  }
`

export const ProfileRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-areas:
    'avatar'
    'identity'
    'actions';

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: 'avatar identity actions';
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    padding-inline: ${({ theme }) => theme.spacing.xl};
    /* Desktop breathing room between the cover and the profile identity. */
    padding-top: ${({ theme }) => theme.spacing.lg};
  }
`

export const AvatarButton = styled.button`
  grid-area: avatar;
  position: relative;
  width: 7.5rem;
  height: 7.5rem;
  margin-top: -3.75rem;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.round};
  background: none;
  cursor: pointer;

  ${noMotionPref} {
    animation: ${pop} 650ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms backwards;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 9rem;
    height: 9rem;
    /* No negative margin on desktop: the avatar stays strictly inside
       ProfileRow instead of overlapping the cover. */
    margin-top: 0;
  }
`

export const AvatarFrame = styled.span`
  grid-area: avatar;
  position: relative;
  display: block;
  width: 7.5rem;
  height: 7.5rem;
  margin-top: -3.75rem;

  ${noMotionPref} {
    animation: ${pop} 650ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms backwards;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 9rem;
    height: 9rem;
    margin-top: 0;
  }
`

export const Avatar = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  /* Light gray ring in light mode; the theme's border tone in dark mode. */
  border: 4px solid
    ${({ theme }) =>
      theme.mode === 'dark' ? theme.colors.border.default : '#e9ecef'};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.default};
  object-fit: cover;
`

// Initials fallback when a member has no photo yet.
export const AvatarFallback = styled.span`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border: 4px solid
    ${({ theme }) =>
      theme.mode === 'dark' ? theme.colors.border.default : '#e9ecef'};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: 0.02em;
`

export const Identity = styled.div`
  display: grid;
  grid-area: identity;
  gap: 0;
  align-content: start;

  /* Name, role, bio and stats rise one after another. */
  ${noMotionPref} {
    & > * {
      animation: ${rise} 550ms ease-out backwards;
    }

    & > :nth-child(1) {
      animation-delay: 250ms;
    }

    & > :nth-child(2) {
      animation-delay: 350ms;
    }

    & > :nth-child(3) {
      animation-delay: 450ms;
    }

    & > :nth-child(4) {
      animation-delay: 550ms;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.sm};
    align-content: end;
  }
`

export const Name = styled.h1`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: 0.02em;
  line-height: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-bottom: 0;
  }
`

export const Role = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const Stats = styled.dl`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
`

export const Stat = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const StatCount = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const StatLabel = styled.dt`
  order: 2;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const StatSeparator = styled.span`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.6;
  flex-shrink: 0;
`

export const Bio = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-area: actions;
  gap: ${({ theme }) => theme.spacing.sm};

  & > * {
    flex: 1 1 auto;
    white-space: nowrap;
  }

  ${noMotionPref} {
    animation: ${rise} 550ms ease-out 550ms backwards;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-bottom: ${({ theme }) => theme.spacing.xs};
  }
`

/* Hero-only sizing: compact height, same tokens as the shared buttons. */
const heroButtonSizing = css`
  min-height: 2.75rem;
  padding-top: ${({ theme }) => theme.spacing.xs};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`

/* Hero-specific compact sizing; colors come from the shared PrimaryButton. */
export const ContactButton = styled(PrimaryButton)`
  ${heroButtonSizing}
`

export const ProjectsButton = styled(SecondaryButton)`
  ${heroButtonSizing}
`

// Full-view images for the bare lightbox: as large as the viewport allows.
export const LightboxImage = styled.img`
  display: block;
  width: auto;
  max-width: min(100%, 40rem);
  max-height: 80vh;
  max-height: 80dvh;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  object-fit: contain;
`

export const LightboxCover = styled.div`
  position: relative;
  width: min(92vw, 80rem);
  max-height: 80vh;
  max-height: 80dvh;
  aspect-ratio: 16 / 6;
  min-height: 14rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  background: #00243e;
  background-image: radial-gradient(
    rgba(254, 254, 254, 0.14) 1px,
    transparent 1.5px
  );
  background-size: 1.5rem 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 22rem;
  }
`
