import * as S from './styles/final-cta.styled'

export function FinalCta() {
  return (
    <S.Banner aria-labelledby="final-cta-title">
      <S.Title id="final-cta-title">Build Better Together.</S.Title>
      <S.Description>Tell us about your project.</S.Description>
      <S.Actions>
        <S.PrimaryButton to="/contact">Start a Project</S.PrimaryButton>
        <S.SecondaryButton to="/#services">
          Explore Our Services
        </S.SecondaryButton>
      </S.Actions>
    </S.Banner>
  )
}
