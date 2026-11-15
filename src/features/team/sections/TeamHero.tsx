import { ArrowLeft, Phone } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'
import { ProfileCoverArt } from '@/components/ui/ProfileCoverArt'
import type { TeamMember } from '@/data'
import * as S from '@/components/ui/styles/profile-hero.styled'

type HeroStats = { label: string; value: string }

function statsFor(member: TeamMember): HeroStats[] {
  if (member.facts.length > 0) return [...member.facts]
  return [
    { label: 'Skills', value: String(member.skills.length) },
    { label: 'Roles', value: String(member.experience.length) },
    { label: 'Schools', value: String(member.education.length) },
  ].filter((stat) => stat.value !== '0')
}

type TeamHeroProps = {
  member: TeamMember
}

export function TeamHero({ member }: TeamHeroProps) {
  const [lightbox, setLightbox] = useState(false)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const stats = statsFor(member)

  return (
    <S.HeroSection aria-labelledby={`member-${member.slug}-name`}>
      <S.CoverBleed>
        <S.Cover aria-hidden="true">
          <ProfileCoverArt variant="member" monogram={member.initials} />
        </S.Cover>
      </S.CoverBleed>
      <S.ProfileRow>
        {member.avatar ? (
          <S.AvatarButton
            type="button"
            aria-haspopup="dialog"
            aria-label={`Open profile image of ${member.name}`}
            onClick={(event) => {
              setTrigger(event.currentTarget)
              setLightbox(true)
            }}
          >
            <S.Avatar src={member.avatar.src} alt="" aria-hidden="true" />
          </S.AvatarButton>
        ) : (
          <S.AvatarFrame>
            <S.AvatarFallback aria-hidden="true">
              {member.initials}
            </S.AvatarFallback>
          </S.AvatarFrame>
        )}
        <S.Identity>
          <S.Name id={`member-${member.slug}-name`}>{member.name}</S.Name>
          <S.Role>{member.role}</S.Role>
          <S.Bio>{member.headline}</S.Bio>
          {stats.length > 0 && (
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
          )}
        </S.Identity>
        <S.Actions>
          <S.ContactButton to="/contact">
            <Phone size={18} strokeWidth={2} aria-hidden="true" />
            Contact
          </S.ContactButton>
          <S.ProjectsButton to="/#team">
            <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
            Back to team
          </S.ProjectsButton>
        </S.Actions>
      </S.ProfileRow>

      {lightbox && member.avatar && (
        <Lightbox
          bare
          title={`Profile image of ${member.name}`}
          onClose={() => setLightbox(false)}
          returnFocusTo={trigger}
        >
          <S.LightboxImage src={member.avatar.src} alt={member.avatar.alt} />
        </Lightbox>
      )}
    </S.HeroSection>
  )
}
