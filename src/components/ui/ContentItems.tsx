import { Check } from 'lucide-react'
import type { ContentItem } from '@/data'
import * as S from './styles/content-items.styled'

export type ContentItemsVariant = 'numbered' | 'ruled' | 'checklist'

type ContentItemsProps = {
  items: readonly ContentItem[] | null
  /** numbered: steps/principles; ruled: editorial columns; checklist: commitments. */
  variant?: ContentItemsVariant
}

/** Renders a pages.json item list (title + text) in one of three layouts. */
export function ContentItems({ items, variant = 'ruled' }: ContentItemsProps) {
  if (!items?.length) return null

  return (
    <S.List $variant={variant}>
      {items.map((item, index) => (
        <S.Item key={item.title} $variant={variant}>
          {variant === 'numbered' && (
            <S.Index aria-hidden="true">{String(index + 1).padStart(2, '0')}</S.Index>
          )}
          {variant === 'checklist' && (
            <S.Check aria-hidden="true">
              <Check size={14} strokeWidth={3} />
            </S.Check>
          )}
          <div>
            <S.Title>{item.title}</S.Title>
            <S.Text>{item.text}</S.Text>
          </div>
        </S.Item>
      ))}
    </S.List>
  )
}
