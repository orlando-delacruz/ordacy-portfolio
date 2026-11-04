import type { ReactNode } from 'react'
import * as S from './styles/section.styled'

type SectionProps = {
  id?: string
  title: string
  description?: string
  children: ReactNode
}

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <S.Wrapper id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <S.Header>
        <S.Title id={id ? `${id}-title` : undefined}>{title}</S.Title>
        {description && <S.Description>{description}</S.Description>}
      </S.Header>
      {children}
    </S.Wrapper>
  )
}
