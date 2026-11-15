import * as S from './styles/profile-hero.styled'

type ProfileCoverArtProps = {
  /** Brand cover (ring) or member cover (ring + initials monogram). */
  variant: 'brand' | 'member'
  monogram?: string
}

// Quiet cover artwork: a dotted field with a single ring, plus a member
// monogram on profile covers. No ambient motion.
export function ProfileCoverArt({ variant, monogram }: ProfileCoverArtProps) {
  return (
    <>
      <S.CoverRingLarge />
      {variant === 'member' && monogram && (
        <S.CoverMonogram aria-hidden="true">{monogram}</S.CoverMonogram>
      )}
    </>
  )
}
