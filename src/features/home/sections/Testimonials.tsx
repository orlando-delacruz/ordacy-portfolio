import { MessagesSquare } from 'lucide-react'
import { Section } from '../components/Section'
import * as S from './styles/testimonials.styled'

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      title="What Clients Say."
      description="Real feedback, published with permission."
    >
      <S.EmptyState>
        <MessagesSquare size={24} strokeWidth={2} aria-hidden="true" />
        <div>
          <S.EmptyTitle>Client stories coming soon.</S.EmptyTitle>
          <S.EmptyText>
            We only publish genuine client testimonials. New feedback from
            completed projects will appear here once approved for publication.
          </S.EmptyText>
        </div>
      </S.EmptyState>
      <S.Actions>
        <S.SecondaryButton to="/testimonials">
          View Testimonials
        </S.SecondaryButton>
      </S.Actions>
    </Section>
  )
}
