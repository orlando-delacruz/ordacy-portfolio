import styled, { css, keyframes } from 'styled-components'
import { PrimaryButton, SecondaryAnchor, SecondaryButton } from '@/components/ui/styles/buttons.styled'
import { fluidFont } from '@/styles/typography'

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
  /*
   * The box is pulled up behind the sticky top bar (plus the shell's own
   * content padding it must cancel). The cover starts directly under the bar;
   * only the bottom keeps the 40px section rhythm.
   */
  margin-top: calc(
    -1 * var(--top-bar-height) - ${({ theme }) => theme.spacing.xl}
  );
  padding: var(--top-bar-height) 0 2.5rem;
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

// `$compact` is for mastheads that need the brand cover as a band rather than
// a full profile cover; profile heroes keep the default heights. `$photo`
// swaps the generated dot grid for the brand cover photograph.
export const Cover = styled.div<{ $compact?: boolean; $photo?: boolean }>`
  position: relative;
  min-height: ${({ $compact }) => ($compact ? '7rem' : '12rem')};
  overflow: hidden;
  background-color: #00243e;
  background-image: ${({ $photo }) =>
    $photo
      ? "url('/images/ordacy-home-hero.png')"
      : `radial-gradient(
          rgba(254, 254, 254, 0.14) 1px,
          transparent 1.5px
        )`};
  background-repeat: no-repeat;
  background-size: ${({ $photo }) => ($photo ? 'cover' : '1.5rem 1.5rem')};
  background-position: ${({ $photo }) => ($photo ? 'center' : '0 0')};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    /* The photo is 2.25:1; let the cover grow with the viewport so the laptop
       and pedestal are not cropped into a thin strip on wide screens. */
    min-height: ${({ $compact, $photo }) =>
      $compact ? '9.5rem' : $photo ? 'clamp(17rem, 34vw, 30rem)' : '17rem'};
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

  /* Tablet/small laptop: the avatar spans the identity and actions rows so
     the identity never gets squeezed by the fixed-width action group. */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      'avatar identity'
      'avatar actions';
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    padding-inline: ${({ theme }) => theme.spacing.xl};
    /* Breathing room between the cover and the profile identity. */
    padding-top: ${({ theme }) => theme.spacing.lg};
  }

  /* Wide desktop: the original single row. */
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: 'avatar identity actions';
  }
`

export const AvatarButton = styled.button<{ $strip?: boolean }>`
  grid-area: avatar;
  position: relative;
  width: 7.5rem;
  height: 7.5rem;
  margin-top: ${({ $strip }) => ($strip ? '0' : '-3.75rem')};
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

export const AvatarFrame = styled.span<{ $strip?: boolean }>`
  grid-area: avatar;
  position: relative;
  display: block;
  width: 7.5rem;
  height: 7.5rem;
  margin-top: ${({ $strip }) => ($strip ? '0' : '-3.75rem')};

  ${noMotionPref} {
    animation: ${pop} 650ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms backwards;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 9rem;
    height: 9rem;
    margin-top: 0;
  }
`

export const Avatar = styled.img<{ $logo?: boolean }>`
  display: block;
  width: 100%;
  height: 100%;
  /* Super-thin ring; on hover the button lights a soft teal halo. */
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.default};
  /* The brand mark must stay whole; member portraits fill the circle. */
  object-fit: ${({ $logo }) => ($logo ? 'contain' : 'cover')};
  transition:
    border-color ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  button:hover &,
  button:focus-visible & {
    border-color: ${({ theme }) => theme.colors.text.accent};
    box-shadow:
      0 0 0 4px
        color-mix(
          in srgb,
          ${({ theme }) => theme.colors.text.accent} 16%,
          transparent
        ),
      0 0 20px
        color-mix(
          in srgb,
          ${({ theme }) => theme.colors.text.accent} 45%,
          transparent
        );
  }
`

// Initials fallback when a member has no photo yet.
export const AvatarFallback = styled.span`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
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
  gap: ${({ theme }) => theme.spacing.lg};
  align-content: start;

  /* Name and bio travel together; the gap above Stats separates the intro
     group from the facts. */
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
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.lg};
    align-content: end;
  }
`

// Name plus bio on the home profile, grouped so the facts can sit apart.
export const Intro = styled.div`
  display: grid;
  gap: 0;
  min-width: 0;
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
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};

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

export const Stats = styled.dl<{ $row?: boolean }>`
  display: grid;
  gap: 0.75rem;
  margin: 0;

  /* Home profile: the company counts stay on one row at every width. */
  ${({ $row }) =>
    $row &&
    css`
      grid-auto-flow: column;
      grid-auto-columns: minmax(0, 1fr);
      gap: 0;

      & > div {
        padding-inline: ${({ theme }) => theme.spacing.sm};

        &:first-of-type {
          padding-left: 0;
        }

        &:last-of-type {
          padding-right: 0;
        }

        &:not(:first-of-type) {
          border-left: 1px solid ${({ theme }) => theme.colors.border.default};
        }
      }
    `}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    /* One column per fact, so two facts fill a half each instead of leaving
       an empty third track. */
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    grid-template-columns: none;
    gap: 0;

    & > div {
      padding-inline: ${({ theme }) => theme.spacing.md};

      &:first-of-type {
        padding-left: 0;
      }

      &:last-of-type {
        padding-right: 0;
      }

      &:not(:first-of-type) {
        border-left: 1px solid ${({ theme }) => theme.colors.border.default};
      }
    }
  }
`

export const Stat = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const StatCount = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};

  /* Keep three facts on one row at the 320px floor. */
  @media (max-width: 24rem) {
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }
`

export const StatLabel = styled.dt`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fluidFont(0.6875)};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.08em;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-transform: uppercase;
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

  /* Phones: links share the row evenly and the like toggle keeps its size, so
     nothing drops onto a line by itself. */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: nowrap;

    & > a {
      flex: 1 1 0;
      min-width: 0;
    }
  }

  /* Above phones the buttons keep their natural width instead of stretching
     across the wider stacked row. */
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    & > * {
      flex: 0 0 auto;
    }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-inline: ${({ theme }) => theme.spacing.sm};
  }
`

export const ProjectsButton = styled(SecondaryButton)`
  ${heroButtonSizing}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-inline: ${({ theme }) => theme.spacing.sm};
  }
`

/* PDF resumes open outside the SPA, so they need a plain anchor. */
export const ResumeButton = styled(SecondaryAnchor)`
  ${heroButtonSizing}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-inline: ${({ theme }) => theme.spacing.sm};
  }
`

// Full-view images for the bare lightbox: leave room for the top bar, the
// caption, and the body padding so the image never runs under them.
export const LightboxImage = styled.img`
  display: block;
  width: auto;
  max-width: min(100%, 40rem);
  max-height: calc(100vh - 14rem);
  max-height: calc(100dvh - 14rem);
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  object-fit: contain;
`

export const LightboxCover = styled.div<{ $photo?: boolean }>`
  position: relative;
  width: min(92vw, 80rem);
  max-height: calc(100vh - 14rem);
  max-height: calc(100dvh - 14rem);
  /* The photo keeps its own 1916x821 frame so contain shows the whole image;
     the generated art keeps the wide band. */
  aspect-ratio: ${({ $photo }) => ($photo ? '1916 / 821' : '16 / 6')};
  min-height: ${({ $photo }) =>
    $photo ? '0' : 'min(14rem, 30dvh)'};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  background-color: #00243e;
  background-image: ${({ $photo }) =>
    $photo
      ? "url('/images/ordacy-home-hero.png')"
      : `radial-gradient(
          rgba(254, 254, 254, 0.14) 1px,
          transparent 1.5px
        )`};
  background-repeat: no-repeat;
  background-size: ${({ $photo }) => ($photo ? 'contain' : '1.5rem 1.5rem')};
  background-position: ${({ $photo }) => ($photo ? 'center' : '0 0')};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: ${({ $photo }) =>
      $photo ? '0' : 'min(22rem, 40dvh)'};
  }
`
