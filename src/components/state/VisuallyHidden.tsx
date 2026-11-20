import type { ReactNode } from 'react'
import * as S from './styles/visually-hidden.styled'

type VisuallyHiddenProps = {
  children: ReactNode
}

/** Screen-reader-only text used by skeleton and spinner labels. */
export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <S.VisuallyHidden>{children}</S.VisuallyHidden>
}
