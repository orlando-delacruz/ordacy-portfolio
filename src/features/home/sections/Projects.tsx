import { FolderKanban } from 'lucide-react'
import { Section } from '../components/Section'
import * as S from './styles/projects.styled'

export function Projects() {
  return (
    <Section
      id="work"
      title="Built to Solve Real Business Needs."
      description="Explore selected projects and concept demonstrations that showcase different ways digital solutions can support business operations."
    >
      <S.EmptyState>
        <FolderKanban size={24} strokeWidth={2} aria-hidden="true" />
        <S.EmptyTitle>Selected work is on its way.</S.EmptyTitle>
        <S.EmptyText>
          Approved client projects and clearly labeled concept demonstrations
          will be showcased here. Nothing is published without permission, and
          unfinished work stays private.
        </S.EmptyText>
      </S.EmptyState>
      <S.Actions>
        <S.SecondaryButton to="/projects">View All Projects</S.SecondaryButton>
      </S.Actions>
    </Section>
  )
}
