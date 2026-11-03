import styled from 'styled-components'
import { MessagesSquare } from 'lucide-react'
import { SecondaryButton } from '../components/Buttons'
import { Section } from '../components/Section'

const EmptyState = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-items: start;
  max-width: 44rem;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

const EmptyTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

const Actions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      title="What Clients Say About Working With Us."
      description="Trust is built through clear communication, thoughtful solutions, and reliable collaboration."
    >
      <EmptyState>
        <MessagesSquare size={24} strokeWidth={2} aria-hidden="true" />
        <div>
          <EmptyTitle>Client stories coming soon.</EmptyTitle>
          <EmptyText>
            We only publish genuine client testimonials. New feedback from
            completed projects will appear here once approved for publication.
          </EmptyText>
        </div>
      </EmptyState>
      <Actions>
        <SecondaryButton to="/testimonials">
          View Testimonials
        </SecondaryButton>
      </Actions>
    </Section>
  )
}
