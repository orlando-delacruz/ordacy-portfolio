import * as S from '@/components/common/styles/page.styled'

type PagePlaceholderProps = {
  title: string
  description: string
}

export function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <S.PageSection aria-labelledby="page-placeholder-title">
      <S.PageEyebrow>Foundation</S.PageEyebrow>
      <S.PageTitle id="page-placeholder-title">{title}</S.PageTitle>
      <S.PageDescription>{description}</S.PageDescription>
    </S.PageSection>
  )
}
