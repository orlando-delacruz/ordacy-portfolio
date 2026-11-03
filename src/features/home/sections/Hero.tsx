import { useState } from 'react'
import styled, { css } from 'styled-components'
import { useAppTheme } from '@/app/theme-context'
import darkLogo from '@/assets/images/ordacy-logo-dark-mode.png'
import lightLogo from '@/assets/images/ordacy-logo.png'
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import { Lightbox } from '../components/Lightbox'

const HeroSection = styled.section`
  margin-top: calc(-1 * ${({ theme }) => theme.spacing.xl});
  padding-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-bottom: ${({ theme }) => theme.spacing['3xl']};
  }
`

const CoverBleed = styled.div`
  margin-inline: calc(-1 * ${({ theme }) => theme.spacing.lg});
`

const CoverButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  cursor: zoom-in;
  text-align: inherit;
`

const Cover = styled.div`
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
  }
`

const CoverRing = styled.span`
  position: absolute;
  border: 3px solid rgba(0, 218, 185, 0.35);
  border-radius: ${({ theme }) => theme.radii.round};
  pointer-events: none;
`

const CoverRingLarge = styled(CoverRing)`
  top: -6rem;
  right: -4rem;
  width: 18rem;
  height: 18rem;
`

const CoverRingSmall = styled(CoverRing)`
  right: 6rem;
  bottom: -5rem;
  width: 10rem;
  height: 10rem;
  border-color: rgba(0, 205, 175, 0.25);
`

const CoverBar = styled.span`
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

const ProfileRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-areas:
    'avatar'
    'name'
    'stats'
    'bio'
    'actions';

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      'avatar name actions'
      'avatar stats actions'
      'avatar bio actions';
    align-items: end;
    gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    padding-inline: ${({ theme }) => theme.spacing.xl};
    /* Desktop breathing room between the cover and the profile identity.
       The avatar overlap below is deepened by the same amount. */
    padding-top: ${({ theme }) => theme.spacing.lg};
  }
`

const AvatarButton = styled.button`
  grid-area: avatar;
  position: relative;
  width: 7.5rem;
  height: 7.5rem;
  margin-top: -3.75rem;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.round};
  background: none;
  cursor: zoom-in;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 9rem;
    height: 9rem;
    margin-top: calc(-4.5rem - ${({ theme }) => theme.spacing.lg});
  }
`

const Avatar = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border: 4px solid ${({ theme }) => theme.colors.surface.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ theme }) => theme.shadows.md};
  object-fit: cover;
`

const OnlineDot = styled.span`
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

const OnlinePulse = styled.span`
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

const Name = styled.h1`
  grid-area: name;
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

const Stats = styled.dl`
  display: flex;
  flex-wrap: wrap;
  grid-area: stats;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
`

const Stat = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
`

const StatCount = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

const StatLabel = styled.dt`
  order: 2;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

const StatSeparator = styled.span`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.6;
  flex-shrink: 0;
`

const Bio = styled.p`
  grid-area: bio;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

const Actions = styled.div`
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
const ContactButton = styled(PrimaryButton)`
  ${heroButtonSizing}
`

const ProjectsButton = styled(SecondaryButton)`
  ${heroButtonSizing}
`

const LightboxImage = styled.img`
  display: block;
  width: auto;
  max-width: 100%;
  max-height: 60vh;
  max-height: 60dvh;
  border-radius: ${({ theme }) => theme.radii.md};
  object-fit: contain;
`

const LightboxCover = styled.div`
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

const Caption = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-align: center;
`

type LightboxContent = 'cover' | 'avatar' | null

export function Hero() {
  const { theme } = useAppTheme()
  const [lightbox, setLightbox] = useState<LightboxContent>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)

  const logo = theme === 'dark' ? darkLogo : lightLogo

  const openLightbox =
    (content: Exclude<LightboxContent, null>) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setTrigger(event.currentTarget)
      setLightbox(content)
    }

  return (
    <HeroSection aria-labelledby="profile-name">
      <CoverBleed>
        <CoverButton
          type="button"
          aria-haspopup="dialog"
          aria-label="Open cover image"
          onClick={openLightbox('cover')}
        >
          <Cover aria-hidden="true">
            <CoverRingLarge aria-hidden="true" />
            <CoverRingSmall aria-hidden="true" />
            <CoverBar aria-hidden="true" />
          </Cover>
        </CoverButton>
      </CoverBleed>
      <ProfileRow>
        <AvatarButton
          type="button"
          aria-haspopup="dialog"
          aria-label="Open profile image"
          onClick={openLightbox('avatar')}
        >
          <Avatar src={logo} alt="" aria-hidden="true" />
          <OnlineDot title="Active" aria-hidden="true">
            <OnlinePulse aria-hidden="true" />
          </OnlineDot>
        </AvatarButton>
        <Name id="profile-name">Ordacy</Name>
        <Stats>
          {/* Placeholder counts until real analytics and project data exist. */}
          <Stat>
            <StatCount>1k</StatCount>
            <StatLabel>Visitors</StatLabel>
          </Stat>
          <StatSeparator aria-hidden="true" />
          <Stat>
            <StatCount>20</StatCount>
            <StatLabel>Projects</StatLabel>
          </Stat>
        </Stats>
        <Bio>Build Better. Grow Further.</Bio>
        <Actions>
          <ContactButton to="/contact">Contact</ContactButton>
          <ProjectsButton to="/projects">Projects</ProjectsButton>
        </Actions>
      </ProfileRow>

      {lightbox && (
        <Lightbox
          title={lightbox === 'cover' ? 'Cover image' : 'Profile image'}
          onClose={() => setLightbox(null)}
          returnFocusTo={trigger}
        >
          {lightbox === 'cover' ? (
            <div>
              <LightboxCover aria-hidden="true">
                <CoverRingLarge aria-hidden="true" />
                <CoverRingSmall aria-hidden="true" />
                <CoverBar aria-hidden="true" />
              </LightboxCover>
              <Caption>
                Cover artwork preview. A full-size cover photo can be added
                here when available.
              </Caption>
            </div>
          ) : (
            <div>
              <LightboxImage src={logo} alt="Ordacy logo at full size" />
              <Caption>Ordacy logo.</Caption>
            </div>
          )}
        </Lightbox>
      )}
    </HeroSection>
  )
}
