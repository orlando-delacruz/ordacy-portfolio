import styled from 'styled-components'
import { FolderKanban } from 'lucide-react'
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

export function Projects() {
  return (
    <Section
      id="work"
      title="Built to Solve Real Business Needs."
      description="Explore selected projects and concept demonstrations that showcase different ways digital solutions can support business operations."
    >
      <EmptyState>
        <FolderKanban size={24} strokeWidth={2} aria-hidden="true" />
        <EmptyTitle>Selected work is on its way.</EmptyTitle>
        <EmptyText>
          Approved client projects and clearly labeled concept demonstrations
          will be showcased here. Nothing is published without permission, and
          unfinished work stays private.
        </EmptyText>
      </EmptyState>
      <Actions>
        <SecondaryButton to="/projects">View All Projects</SecondaryButton>
      </Actions>
    </Section>
  )
}
