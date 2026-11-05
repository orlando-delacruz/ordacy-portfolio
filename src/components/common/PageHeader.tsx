import * as S from './styles/page.styled'

type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <S.PageHeader>
      <S.PageEyebrow data-reveal="">{eyebrow}</S.PageEyebrow>
      <S.PageTitle data-reveal="1">{title}</S.PageTitle>
      <S.PageDescription data-reveal="2">{description}</S.PageDescription>
    </S.PageHeader>
  )
}
