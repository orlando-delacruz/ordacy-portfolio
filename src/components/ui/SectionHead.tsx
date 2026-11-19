import type { ReactNode } from 'react'
import * as S from './styles/section-head.styled'

type SectionHeadProps = {
  /** Section id; the heading gets `${id}-title`. */
  id?: string
  title: string
  description?: string
  /** Optional control shown beside the heading (e.g. the currency toggle). */
  action?: ReactNode
  /** Tighter gap for headings inside cards or compact blocks. */
  compact?: boolean
}

/**
 * The one section-heading design: left-aligned title and description, no
 * eyebrow or rule, optional control on the right. Used by Section and by the
 * pages that build their own section wrappers.
 */
export function SectionHead({
  id,
  title,
  description,
  action,
  compact,
}: SectionHeadProps) {
  return (
    <S.Header $withAction={action !== undefined} $compact={compact}>
      <S.Text>
        <S.Title id={id ? `${id}-title` : undefined} tabIndex={-1} data-reveal="">
          {title}
        </S.Title>
        {description && (
          <S.Description data-reveal="1">{description}</S.Description>
        )}
      </S.Text>
      {action && <div data-reveal="1">{action}</div>}
    </S.Header>
  )
}
