import { ArrowLeft, FileText, Phone, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppTheme } from '@/app/theme-context'
import { Lightbox } from '@/components/ui/Lightbox'
import { PageHero } from '@/components/ui/PageHero'
import { ProfileCoverArt } from '@/components/ui/ProfileCoverArt'
import * as S from '@/components/ui/styles/profile-hero.styled'
import type { TeamMember } from '@/data'
import * as T from '../styles/team-hero.styled'
import { teamAvatarSrc } from '../avatar'

type HeroStats = { label: string; value: string }

function statsFor(member: TeamMember): HeroStats[] {
  if (member.facts.length > 0) return [...member.facts]
  return [
    { label: 'Skills', value: String(skillCount(member)) },
    { label: 'Roles', value: String(member.experience.length) },
    { label: 'Schools', value: String(member.education.length) },
  ].filter((stat) => stat.value !== '0')
}

function skillCount(member: TeamMember): number {
  if (member.skillGroups && member.skillGroups.length > 0) {
    return member.skillGroups.reduce(
      (total, group) => total + group.items.length,
      0,
    )
  }
  return member.skills.length
}

type TeamHeroProps = {
  member: TeamMember
}

export function TeamHero({ member }: TeamHeroProps) {
  const { theme } = useAppTheme()
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState(false)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const stats = statsFor(member)
  const avatarSrc = teamAvatarSrc(member.avatar, theme)

  return (
    <>
      <PageHero
        titleId={`member-${member.slug}-name`}
        eyebrow="People behind Ordacy"
        badgeIcon={UsersRound}
        title={member.name}
        description={member.headline}
        art={<ProfileCoverArt variant="member" monogram={member.initials} />}
      />

      <T.ProfileStrip>
        {avatarSrc ? (
          <S.AvatarButton
            $strip
            type="button"
            aria-haspopup="dialog"
            aria-label={`Open profile image of ${member.name}`}
            onClick={(event) => {
              setTrigger(event.currentTarget)
              setLightbox(true)
            }}
          >
            <S.Avatar src={avatarSrc} alt="" aria-hidden="true" />
          </S.AvatarButton>
        ) : (
          <S.AvatarFrame $strip>
            <S.AvatarFallback aria-hidden="true">
              {member.initials}
            </S.AvatarFallback>
          </S.AvatarFrame>
        )}

        <S.Identity>
          <T.RoleGroup>
            <T.StripName>{member.name}</T.StripName>
            <T.StripRole>{member.role}</T.StripRole>
          </T.RoleGroup>
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
          {member.resumeUrl && (
            <S.ResumeButton
              href={member.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} resume (opens in a new tab)`}
            >
              <FileText size={18} strokeWidth={2} aria-hidden="true" />
              Resume
            </S.ResumeButton>
          )}
          <T.BackButton
            type="button"
            aria-label="Back to team"
            title="Back to team"
            onClick={() => navigate('/#team')}
          >
            <ArrowLeft size={20} strokeWidth={2} aria-hidden="true" />
          </T.BackButton>
        </S.Actions>
      </T.ProfileStrip>

      {lightbox && avatarSrc && member.avatar && (
        <Lightbox
          bare
          title={`Profile image of ${member.name}`}
          caption={`${member.name} · ${member.role}`}
          onClose={() => setLightbox(false)}
          returnFocusTo={trigger}
        >
          <S.LightboxImage src={avatarSrc} alt={member.avatar.alt} />
        </Lightbox>
      )}
    </>
  )
}
