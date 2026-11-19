import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import * as S from './styles/no-results.styled'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  children?: ReactNode
}

/** Centered no-results block with an optional action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <S.Wrapper>
      <S.Icon aria-hidden="true">
        <Icon size={24} strokeWidth={2} />
      </S.Icon>
      <S.Title>{title}</S.Title>
      <S.Description>{description}</S.Description>
      {children && <S.Actions>{children}</S.Actions>}
    </S.Wrapper>
  )
}
