import { team } from '@/data'
import * as S from '../styles/team-strip.styled'

// Compact team strip for the homepage hero: an inline label, a three-word
// line, and separated circular avatars below, linking to each member profile.
export function TeamStrip() {
  if (team.length === 0) return null

  return (
    <S.Strip id="team" aria-label="People behind Ordacy">
      <S.StripText>
        <S.StripLabel>People behind Ordacy</S.StripLabel>
        <S.StripWords>Plan. Build. Support.</S.StripWords>
      </S.StripText>
      <S.AvatarCluster>
        {team.map((member) => (
          <S.AvatarItem key={member.id}>
            <S.AvatarLink
              to={`/team/${member.slug}`}
              title={`View ${member.name} — ${member.role}`}
              aria-label={`View ${member.name}, ${member.role}`}
            >
              {member.avatar ? (
                <S.AvatarImage
                  src={member.avatar.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                member.initials
              )}
            </S.AvatarLink>
          </S.AvatarItem>
        ))}
      </S.AvatarCluster>
    </S.Strip>
  )
}
