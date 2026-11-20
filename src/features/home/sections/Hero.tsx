import { useState } from 'react'
import { FolderKanban, Phone, ThumbsUp } from 'lucide-react'
import { useAppTheme } from '@/app/theme-context'
import darkAvatar from '@/assets/images/ordacy-avatar-dark-mode.png'
import lightAvatar from '@/assets/images/ordacy-avatar.png'
import { Lightbox } from '@/components/ui/Lightbox'
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

export function Hero() {
  const { theme } = useAppTheme()
  const [lightbox, setLightbox] = useState<LightboxContent>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const [liked, setLiked] = useState(readLiked)
  // Remounts the icon so the pop animation restarts on every click.
  const [likePulse, setLikePulse] = useState(0)

  const avatar = theme === 'dark' ? darkAvatar : lightAvatar

  const toggleLike = () => {
    setLikePulse((pulse) => pulse + 1)
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
          <S.Cover $photo aria-hidden="true" />
        </S.CoverButton>
      </S.CoverBleed>
      <S.ProfileRow>
        <S.AvatarButton
          type="button"
          aria-haspopup="dialog"
          aria-label="Open profile image"
          onClick={openLightbox('avatar')}
        >
          <S.Avatar $logo src={avatar} alt="" aria-hidden="true" />
          <S.OnlineDot title="Active" aria-hidden="true">
            <S.OnlinePulse aria-hidden="true" />
          </S.OnlineDot>
        </S.AvatarButton>
        <S.Identity>
          <S.Intro>
            <S.Name id="profile-name">
              {site.name}
            </S.Name>
            <S.Bio>{getSection('home', 'hero').title}</S.Bio>
          </S.Intro>
          {stats.length > 0 && (
            <S.Stats $row>
              {stats.map((stat) => (
                <S.Stat key={stat.label}>
                  <S.StatLabel>{stat.label}</S.StatLabel>
                  <S.StatCount>{stat.value}</S.StatCount>
                </S.Stat>
              ))}
            </S.Stats>
          )}
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
            <S.LikeIcon key={likePulse} $pulse={likePulse > 0}>
              <ThumbsUp size={20} strokeWidth={2} aria-hidden="true" />
            </S.LikeIcon>
          </S.LikeButton>
        </S.Actions>
      </S.ProfileRow>
      <TeamStrip />

      {lightbox && (
        <Lightbox
          bare
          title={lightbox === 'cover' ? 'Cover image' : 'Profile image'}
          caption={lightbox === 'cover' ? 'Ordacy cover artwork' : 'Ordacy logo'}
          onClose={() => setLightbox(null)}
          returnFocusTo={trigger}
        >
          {lightbox === 'cover' ? (
            <S.LightboxCover
              $photo
              role="img"
              aria-label="Ordacy cover artwork"
            />
          ) : (
            <S.LightboxImage src={avatar} alt="Ordacy logo" />
          )}
        </Lightbox>
      )}
    </S.HeroSection>
  )
}
