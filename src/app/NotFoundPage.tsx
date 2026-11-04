import * as S from './styles/not-found-page.styled'

export function NotFoundPage() {
  return (
    <S.Section aria-labelledby="not-found-title">
      <S.Code>404</S.Code>
      <S.Title id="not-found-title">Page not found</S.Title>
      <S.Description>This page no longer exists.</S.Description>
      <S.HomeLink to="/">Back to home</S.HomeLink>
    </S.Section>
  )
}
