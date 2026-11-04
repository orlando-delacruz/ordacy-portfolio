import { BadgeCheck } from 'lucide-react'
import styled, { css } from 'styled-components'
import { PrimaryButton, SecondaryButton } from '../../components/styles/buttons.styled'

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

const CoverRing = styled.span`
  position: absolute;
  border: 3px solid rgba(0, 218, 185, 0.35);
  border-radius: ${({ theme }) => theme.radii.round};
  pointer-events: none;
`

export const CoverRingLarge = styled(CoverRing)`
  top: -6rem;
  right: -4rem;
  width: 18rem;
  height: 18rem;
`

export const CoverRingSmall = styled(CoverRing)`
  right: 6rem;
  bottom: -5rem;
  width: 10rem;
  height: 10rem;
  border-color: rgba(0, 205, 175, 0.25);
`

export const CoverBar = styled.span`
  position: absolute;
  bottom: 2rem;
  left: -2rem;
  width: 16rem;
  height: 3.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(0, 218, 185, 0.22);
  transform: rotate(-12deg);
  pointer-events: none;
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

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 9rem;
    height: 9rem;
    /* No negative margin on desktop: the avatar stays strictly inside
       ProfileRow instead of overlapping the cover. */
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
  animation: online-pulse 2s ease-out infinite;

  @keyframes online-pulse {
    0% {
      opacity: 0.7;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Identity = styled.div`
  display: grid;
  grid-area: identity;
  gap: 0;
  align-content: start;

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

export const VerifiedBadge = styled(BadgeCheck)`
  /* Solid blue seal: fill and edge stroke match the brand blue, so only
     the center check reads white. The seal is the first path, the check
     the last, since Lucide strokes both with currentColor. */
  color: #1877f2;
  fill: #1877f2;
  flex-shrink: 0;

  & path:last-child {
    stroke: #fff;
  }
`

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
  background: transparent;
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
`

export const LightboxImage = styled.img`
  display: block;
  width: auto;
  max-width: 100%;
  max-height: 60vh;
  max-height: 60dvh;
  border-radius: ${({ theme }) => theme.radii.md};
  object-fit: contain;
`

export const LightboxCover = styled.div`
  position: relative;
  width: min(78vw, 56rem);
  min-height: 16rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
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

export const Caption = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-align: center;
`
