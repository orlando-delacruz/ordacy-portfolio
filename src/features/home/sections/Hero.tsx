import { useState } from 'react'
import { FolderKanban, Phone, ThumbsUp } from 'lucide-react'
import { useAppTheme } from '@/app/theme-context'
import darkLogo from '@/assets/images/ordacy-logo-dark-mode.png'
import lightLogo from '@/assets/images/ordacy-logo.png'
import { Lightbox } from '../components/Lightbox'
import * as S from './styles/hero.styled'

type LightboxContent = 'cover' | 'avatar' | null

export function Hero() {
  const { theme } = useAppTheme()
  const [lightbox, setLightbox] = useState<LightboxContent>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const [liked, setLiked] = useState(false)

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
            <S.CoverRingLarge aria-hidden="true" />
            <S.CoverRingSmall aria-hidden="true" />
            <S.CoverBar aria-hidden="true" />
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
            Ordacy
            <S.VerifiedBadge
              size={20}
              strokeWidth={2.5}
              aria-label="Verified account"
            />
          </S.Name>
          <S.Bio>Build Better. Grow Further.</S.Bio>
          <S.Stats>
            {/* Placeholder counts until real analytics and project data exist. */}
            <S.Stat>
              <S.StatLabel>Visitors</S.StatLabel>
              <S.StatCount>1k</S.StatCount>
            </S.Stat>
            <S.StatSeparator aria-hidden="true" />
            <S.Stat>
              <S.StatLabel>Projects</S.StatLabel>
              <S.StatCount>20</S.StatCount>
            </S.Stat>
            <S.StatSeparator aria-hidden="true" />
            <S.Stat>
              <S.StatLabel>Likes</S.StatLabel>
              <S.StatCount>1k</S.StatCount>
            </S.Stat>
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
            onClick={() => setLiked((prev) => !prev)}
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

      {lightbox && (
        <Lightbox
          title={lightbox === 'cover' ? 'Cover image' : 'Profile image'}
          onClose={() => setLightbox(null)}
          returnFocusTo={trigger}
        >
          {lightbox === 'cover' ? (
            <div>
              <S.LightboxCover aria-hidden="true">
                <S.CoverRingLarge aria-hidden="true" />
                <S.CoverRingSmall aria-hidden="true" />
                <S.CoverBar aria-hidden="true" />
              </S.LightboxCover>
              <S.Caption>
                Cover artwork preview. A full-size cover photo can be added
                here when available.
              </S.Caption>
            </div>
          ) : (
            <div>
              <S.LightboxImage src={logo} alt="Ordacy logo at full size" />
              <S.Caption>Ordacy logo.</S.Caption>
            </div>
          )}
        </Lightbox>
      )}
    </S.HeroSection>
  )
}
