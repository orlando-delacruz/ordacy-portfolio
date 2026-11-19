import type { Step } from '@/data'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import * as S from '../styles/journey.styled'

type JourneyProps = {
  steps: readonly Step[]
}

/** Journey as icon nodes: a vertical rail on mobile, one connected row from lg. */
export function Journey({ steps }: JourneyProps) {
  // Rails draw and nodes pop in once, the first time the row is seen.
  const [listRef, revealed] = useRevealOnce<HTMLOListElement>(0.3)

  return (
    <S.List ref={listRef} data-revealed={revealed || undefined}>
      {steps.map((step, index) => {
        const Icon = step.icon
        return (
          <S.Item key={step.id} $index={index}>
            <S.Node aria-hidden="true">
              <Icon size={20} strokeWidth={2} />
            </S.Node>
            <S.Body>
              <S.Title>{step.title}</S.Title>
            </S.Body>
          </S.Item>
        )
      })}
    </S.List>
  )
}
