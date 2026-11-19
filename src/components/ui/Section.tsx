import type { ReactNode } from 'react'
import { SectionHead } from './SectionHead'
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
    <S.Wrapper
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <SectionHead
        id={id}
        title={title}
        description={description}
        action={headerAction}
      />
      {/* Content follows the heading in (scroll reveal, see GlobalStyles). */}
      <div data-reveal="2">{children}</div>
    </S.Wrapper>
  )
}
