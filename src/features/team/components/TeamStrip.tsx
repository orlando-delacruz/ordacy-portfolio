import { Eye, UsersRound } from 'lucide-react'
import { useAppTheme } from '@/app/theme-context'
import { team } from '@/data'
import * as S from '../styles/team-strip.styled'
import { teamAvatarSrc } from '../avatar'

// Team strip for the homepage hero: each person links to their profile with a
// portrait, name, and role. The first member gets the featured treatment.
export function TeamStrip() {
  const { theme } = useAppTheme()

  if (team.length === 0) return null

  return (
    <S.Strip id="team" aria-label="People behind Ordacy">
      <S.StripLabel>
        <S.LabelIcon aria-hidden="true">
          <UsersRound size={14} strokeWidth={2.25} />
        </S.LabelIcon>
        People behind Ordacy
      </S.StripLabel>
      <S.AvatarCluster>
        {team.map((member) => {
          const isFeatured = member.displayOrder === 1
          const MemberLink = isFeatured ? S.FounderLink : S.AvatarLink
          const avatarSrc = teamAvatarSrc(member.avatar, theme)

          return (
            <S.AvatarItem key={member.id}>
              <MemberLink
                to={`/team/${member.slug}`}
                title={`View ${member.name} — ${member.role}`}
                aria-label={`View ${member.name}, ${member.role}`}
              >
                <S.AvatarFrame>
                  {avatarSrc ? (
                    <S.AvatarImage
                      src={avatarSrc}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <S.AvatarFallback aria-hidden="true">
                      {member.initials}
                    </S.AvatarFallback>
                  )}
                </S.AvatarFrame>
                <S.MemberInfo>
                  <S.MemberName>{member.name}</S.MemberName>
                  <S.MemberRole>
                    <S.MemberRoleText>{member.role}</S.MemberRoleText>
                  </S.MemberRole>
                  <S.ViewProfile>
                    <Eye size={14} strokeWidth={2.5} aria-hidden="true" />
                    View Profile
                  </S.ViewProfile>
                </S.MemberInfo>
                <S.MemberInitials aria-hidden="true">
                  {member.initials}
                </S.MemberInitials>
              </MemberLink>
            </S.AvatarItem>
          )
        })}
      </S.AvatarCluster>
    </S.Strip>
  )
}
