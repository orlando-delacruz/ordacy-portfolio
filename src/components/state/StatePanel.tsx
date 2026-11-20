import { CheckCircle2, CircleAlert, Inbox } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { StateTone } from './types'
import * as S from './styles/state-panel.styled'

export type { StateTone }

type StatePanelProps = {
  tone: StateTone
  title: string
  description: string
  icon?: LucideIcon
  actions?: ReactNode
  /** Page-level states use 2 beneath the real hero; standalone pages use 1. */
  headingLevel?: 1 | 2
  compact?: boolean
}

const defaultIcons: Record<StateTone, LucideIcon> = {
  empty: Inbox,
  error: CircleAlert,
  success: CheckCircle2,
}

/**
 * One centered empty/error/success panel. The page hero keeps the page's h1;
 * a page-level state panel sits beneath it at h2.
 */
export function StatePanel({
  tone,
  title,
  description,
  icon,
  actions,
  headingLevel = 2,
  compact = false,
}: StatePanelProps) {
  const Icon = icon ?? defaultIcons[tone]

  return (
    <S.Panel role={tone === 'error' ? 'alert' : 'status'} $compact={compact}>
      <S.IconTile $tone={tone} aria-hidden="true">
        <Icon size={24} strokeWidth={2} />
      </S.IconTile>
      <S.Title
        as={headingLevel === 1 ? 'h1' : 'h2'}
        $level={headingLevel}
      >
        {title}
      </S.Title>
      <S.Description>{description}</S.Description>
      {actions && <S.Actions>{actions}</S.Actions>}
    </S.Panel>
  )
}
