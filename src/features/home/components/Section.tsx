import type { ReactNode } from 'react'
import * as S from './styles/section.styled'

type SectionProps = {
  id?: string
  title: string
  description?: string
  headerAction?: ReactNode
  children: ReactNode
}

export function Section({
  id,
  title,
  description,
  headerAction,
  children,
}: SectionProps) {
  return (
    <S.Wrapper id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <S.Header $withAction={headerAction !== undefined}>
        <S.HeaderText>
          <S.Title id={id ? `${id}-title` : undefined} data-reveal="">
            {title}
          </S.Title>
          {description && (
            <S.Description data-reveal="1">{description}</S.Description>
          )}
        </S.HeaderText>
        {headerAction && <div data-reveal="1">{headerAction}</div>}
      </S.Header>
      {/* Content follows the heading in (scroll reveal, see GlobalStyles). */}
      <div data-reveal="2">{children}</div>
    </S.Wrapper>
  )
}
