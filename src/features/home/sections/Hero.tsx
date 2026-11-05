import { Fragment, useState } from 'react'
import { FolderKanban, Phone } from 'lucide-react'
import { useAppTheme } from '@/app/theme-context'
import darkLogo from '@/assets/images/ordacy-logo-dark-mode.png'
import lightLogo from '@/assets/images/ordacy-logo.png'
import { Lightbox } from '@/components/ui/Lightbox'
import * as S from './styles/hero.styled'
import { getSection, plans, services, site } from '@/data'

// Profile stats come from the content itself, never from invented metrics.
const stats = [
  { label: 'Services', value: String(services.length) },
  { label: 'Plans', value: String(plans.length) },
  { label: 'Markets', value: site.markets.length > 1 ? 'PH + Global' : (site.markets[0] ?? '') },
]

type LightboxContent = 'cover' | 'avatar' | null

// Abstract cover artwork: rings, a bar, sparkles, and two floating mock UI cards.
function CoverArt() {
  return (
    <>
      <S.CoverRingLarge />
      <S.CoverRingSmall />
      <S.CoverBar />
      <S.Sparkle $top="22%" $left="38%" $delay={0} />
      <S.Sparkle $top="68%" $left="56%" $delay={1.2} />
      <S.Sparkle $top="30%" $left="78%" $delay={2.4} />
      <S.MockCard $variant="chart">
        <S.MockLine $width="45%" />
        <S.MockBars>
          {[40, 70, 55, 90, 65].map((height, index) => (
            <S.MockBar key={index} $height={height} $index={index} />
          ))}
        </S.MockBars>
      </S.MockCard>
      <S.MockCard $variant="list">
        {[0, 1, 2].map((row) => (
          <S.MockRow key={row}>
            <S.MockDot />
            <S.MockLine $width={row === 1 ? '55%' : '75%'} />
          </S.MockRow>
        ))}
      </S.MockCard>
    </>
  )
}

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
    <S.HeroSection aria-labelledby="profile-name">
      <S.CoverBleed>
        <S.CoverButton
          type="button"
          aria-haspopup="dialog"
          aria-label="Open cover image"
          onClick={openLightbox('cover')}
        >
          <S.Cover aria-hidden="true">
            <CoverArt />
          </S.Cover>
        </S.CoverButton>
      </S.CoverBleed>
      <S.ProfileRow>
        <S.AvatarButton
          type="button"
          aria-haspopup="dialog"
          aria-label="Open profile image"
          onClick={openLightbox('avatar')}
        >
          <S.Avatar src={logo} alt="" aria-hidden="true" />
          <S.OnlineDot title="Active" aria-hidden="true">
            <S.OnlinePulse aria-hidden="true" />
          </S.OnlineDot>
        </S.AvatarButton>
        <S.Identity>
          <S.Name id="profile-name">
            {site.name}
          </S.Name>
          <S.Bio>{getSection('home', 'hero').title}</S.Bio>
          <S.Stats>
            {stats.map((stat, index) => (
              <Fragment key={stat.label}>
                {index > 0 && <S.StatSeparator aria-hidden="true" />}
                <S.Stat>
                  <S.StatLabel>{stat.label}</S.StatLabel>
                  <S.StatCount>{stat.value}</S.StatCount>
                </S.Stat>
              </Fragment>
            ))}
          </S.Stats>
        </S.Identity>
        <S.Actions>
          <S.ContactButton to="/contact">
            <Phone size={18} strokeWidth={2} aria-hidden="true" />
            Contact
          </S.ContactButton>
          <S.ProjectsButton to="/projects">
            <FolderKanban size={18} strokeWidth={2} aria-hidden="true" />
            Projects
          </S.ProjectsButton>
        </S.Actions>
      </S.ProfileRow>

      {lightbox && (
        <Lightbox
          bare
          title={lightbox === 'cover' ? 'Cover image' : 'Profile image'}
          onClose={() => setLightbox(null)}
          returnFocusTo={trigger}
        >
          {lightbox === 'cover' ? (
            <S.LightboxCover role="img" aria-label="Ordacy cover artwork">
              <CoverArt />
            </S.LightboxCover>
          ) : (
            <S.LightboxImage src={logo} alt="Ordacy logo" />
          )}
        </Lightbox>
      )}
    </S.HeroSection>
  )
}
