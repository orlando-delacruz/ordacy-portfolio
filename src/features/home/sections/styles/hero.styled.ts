import { BadgeCheck } from 'lucide-react'
import styled, { css, keyframes } from 'styled-components'
import { PrimaryButton, SecondaryButton } from '../../components/styles/buttons.styled'

/*
 * Motion: on page load the avatar pops in and the name, stats and actions rise
 * after it. The cover art then keeps a slow ambient loop (rings float, the bar
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

const float = keyframes`
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-0.75rem, 0.5rem);
  }
`

const drift = keyframes`
  0%, 100% {
    transform: rotate(-12deg) translateX(0);
  }
  50% {
    transform: rotate(-9deg) translateX(1.5rem);
  }
`

const bob = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(var(--tilt));
  }
  50% {
    transform: translateY(-0.5rem) rotate(var(--tilt));
  }
`

const twinkle = keyframes`
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.6) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(45deg);
  }
`

const sweep = keyframes`
  0% {
    transform: translateX(-120%) skewX(-20deg);
  }
  35%, 100% {
    transform: translateX(320%) skewX(-20deg);
  }
`

const barGrow = keyframes`
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
`

const likePop = keyframes`
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.3) rotate(-12deg);
  }
  65% {
    transform: scale(0.92) rotate(4deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`

const likeBurst = keyframes`
  from {
    opacity: 0.6;
    transform: scale(0.6);
  }
  to {
    opacity: 0;
    transform: scale(1.6);
  }
`

// Soft diagonal light that sweeps across the cover every few seconds.
const coverSweep = css`
  &::after {
    position: absolute;
    inset: 0 auto 0 0;
    width: 30%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(254, 254, 254, 0.07),
      transparent
    );
    transform: translateX(-120%) skewX(-20deg);
    pointer-events: none;
    content: '';
  }

  ${noMotionPref} {
    &::after {
      animation: ${sweep} 7s ease-in-out 1s infinite;
    }
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
  ${coverSweep}
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

  ${noMotionPref} {
    animation: ${float} 10s ease-in-out infinite;
  }
`

export const CoverRingSmall = styled(CoverRing)`
  right: 6rem;
  bottom: -5rem;
  width: 10rem;
  height: 10rem;
  border-color: rgba(0, 205, 175, 0.25);
  border-style: dashed;

  ${noMotionPref} {
    animation: ${float} 13s ease-in-out -4s infinite reverse;
  }
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

  ${noMotionPref} {
    animation: ${drift} 12s ease-in-out infinite;
  }
`

// Four-point sparkle drawn from two crossed bars.
export const Sparkle = styled.span<{ $top: string; $left: string; $delay: number }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0.6;
  pointer-events: none;

  &::before,
  &::after {
    position: absolute;
    inset: 40% 0;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: rgba(0, 218, 185, 0.85);
    content: '';
  }

  &::after {
    inset: 0 40%;
  }

  ${noMotionPref} {
    animation: ${twinkle} 3.6s ease-in-out ${({ $delay }) => $delay}s infinite;
  }
`

// Frosted mock UI card hinting at the dashboards and systems Ordacy builds.
export const MockCard = styled.span<{ $variant: 'chart' | 'list' }>`
  --tilt: ${({ $variant }) => ($variant === 'chart' ? '-4deg' : '5deg')};

  position: absolute;
  display: grid;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid rgba(254, 254, 254, 0.16);
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(254, 254, 254, 0.07);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  transform: rotate(var(--tilt));
  pointer-events: none;

  ${({ $variant }) =>
    $variant === 'chart'
      ? css`
          top: 18%;
          right: 10%;
          width: 9rem;
        `
      : css`
          right: 32%;
          bottom: 16%;
          display: none;
          width: 8.5rem;

          @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
            display: grid;
          }
        `}

  ${noMotionPref} {
    animation:
      ${rise} 700ms ease-out
        ${({ $variant }) => ($variant === 'chart' ? '300ms' : '500ms')} backwards,
      ${bob} ${({ $variant }) => ($variant === 'chart' ? '6s' : '7.5s')}
        ease-in-out 1s infinite;
  }
`

export const MockLine = styled.span<{ $width: string }>`
  display: block;
  width: ${({ $width }) => $width};
  height: 0.375rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(254, 254, 254, 0.28);
`

export const MockBars = styled.span`
  display: flex;
  align-items: flex-end;
  gap: 0.375rem;
  height: 3rem;
`

export const MockBar = styled.span<{ $height: number; $index: number }>`
  flex: 1;
  height: ${({ $height }) => $height}%;
  border-radius: 0.2rem 0.2rem 0.1rem 0.1rem;
  background: ${({ $index }) =>
    $index === 3 ? 'rgba(0, 218, 185, 0.95)' : 'rgba(0, 218, 185, 0.45)'};
  transform-origin: bottom;

  ${noMotionPref} {
    animation: ${barGrow} 700ms cubic-bezier(0.34, 1.56, 0.64, 1)
      ${({ $index }) => 600 + $index * 90}ms backwards;
  }
`

export const MockRow = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const MockDot = styled.span`
  flex-shrink: 0;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: rgba(0, 218, 185, 0.7);
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

  /* Name, bio and stats rise one after another. */
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

  /* Liking pops the thumb and sends out a ring; re-runs on every like. */
  position: relative;

  &::after {
    position: absolute;
    inset: -1px;
    border: 2px solid ${({ theme }) => theme.colors.text.accent};
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
    content: '';
  }

  ${noMotionPref} {
    svg {
      animation: ${({ $liked }) => ($liked ? likePop : 'none')} 500ms ease-out;
    }

    &::after {
      animation: ${({ $liked }) => ($liked ? likeBurst : 'none')} 550ms ease-out;
    }
  }
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
  ${coverSweep}
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
