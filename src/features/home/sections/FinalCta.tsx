import * as S from './styles/final-cta.styled'

export function FinalCta() {
  return (
    <S.Banner aria-labelledby="final-cta-title">
      <S.Title id="final-cta-title">
        Let&apos;s Build Something That Works Better for Your Business.
      </S.Title>
      <S.Description>
        Tell us about your business, the challenges you&apos;re facing, and what
        you&apos;d like to improve. We&apos;ll help you explore the right
        digital solution.
      </S.Description>
      <S.Actions>
        <S.PrimaryButton to="/contact">Start a Project</S.PrimaryButton>
        <S.SecondaryButton to="/#services">
          Explore Our Services
        </S.SecondaryButton>
      </S.Actions>
    </S.Banner>
  )
}
