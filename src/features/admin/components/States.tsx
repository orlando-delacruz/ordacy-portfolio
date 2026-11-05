import { CircleAlert, Loader2, RotateCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import * as S from './styles/admin-ui.styled'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <S.StateBox role="status">
      <Loader2 size={22} strokeWidth={2} aria-hidden="true" data-spin />
      <p>{label}</p>
    </S.StateBox>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <S.StateBox role="alert">
      <CircleAlert size={22} strokeWidth={2} aria-hidden="true" />
      <h3>Could not load this data.</h3>
      <p>Try again. If it keeps failing, restore the original content in Settings.</p>
      <S.SecondaryAction type="button" onClick={onRetry}>
        <RotateCw size={16} strokeWidth={2} aria-hidden="true" />
        Try again
      </S.SecondaryAction>
    </S.StateBox>
  )
}

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  text: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, text, action }: EmptyStateProps) {
  return (
    <S.StateBox>
      <Icon size={24} strokeWidth={2} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </S.StateBox>
  )
}
