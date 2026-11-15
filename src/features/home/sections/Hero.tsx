import { Fragment, useState } from 'react'
import { FolderKanban, Phone, ThumbsUp } from 'lucide-react'
import { useAppTheme } from '@/app/theme-context'
import darkLogo from '@/assets/images/ordacy-logo-dark-mode.png'
import lightLogo from '@/assets/images/ordacy-logo.png'
import { Lightbox } from '@/components/ui/Lightbox'
import { ProfileCoverArt } from '@/components/ui/ProfileCoverArt'
import { TeamStrip } from '@/features/team/components/TeamStrip'
import * as S from './styles/hero.styled'
import { getSection, site } from '@/data'

const LIKED_KEY = 'ordacy-hero-liked'

function readLiked(): boolean {
  try {
    return localStorage.getItem(LIKED_KEY) === '1'
  } catch {
    return false
  }
}

// Profile stats are site content, edited in Settings. Blank values stay hidden.
const stats = [
  { label: 'Views', value: site.profileStats.views },
  { label: 'Projects', value: site.profileStats.projects },
  { label: 'Likes', value: site.profileStats.likes },
].filter((stat) => stat.value.trim() !== '')

type LightboxContent = 'cover' | 'avatar' | null

// Abstract cover artwork: rings, a bar, sparkles, and two floating mock UI cards.
function CoverArt() {
  return <ProfileCoverArt variant="brand" />
}

export function Hero() {
  const { theme } = useAppTheme()
  const [lightbox, setLightbox] = useState<LightboxContent>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const [liked, setLiked] = useState(readLiked)

  const logo = theme === 'dark' ? darkLogo : lightLogo

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev
      try {
        localStorage.setItem(LIKED_KEY, next ? '1' : '0')
      } catch {
        // Storage unavailable (private mode): keep the state for this visit.
      }
      return next
    })
  }

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
          <S.LikeButton
            type="button"
            $liked={liked}
            aria-pressed={liked}
            aria-label={liked ? 'Unlike' : 'Like'}
            title={liked ? 'Unlike' : 'Like'}
            onClick={toggleLike}
          >
            <ThumbsUp
              size={20}
              strokeWidth={2}
              fill={liked ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
          </S.LikeButton>
        </S.Actions>
      </S.ProfileRow>
      <TeamStrip />

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
