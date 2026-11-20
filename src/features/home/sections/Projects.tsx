import { FolderKanban, MessagesSquare } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { StatePanel } from '@/components/state/StatePanel'
import { showcaseProjects } from '../home.data'
import { ProjectsCarousel } from '@/features/projects/components/ProjectsCarousel'
import * as S from './styles/projects.styled'
import { getSection, sectionCopy } from '@/data'

const count = showcaseProjects.length
const empty = getSection('projects', 'empty')

// Only real, published projects appear. With none, show an intentional state
// instead of an empty carousel.
export function Projects() {
  if (count === 0) {
    return (
      <Section id="work" {...sectionCopy('home', 'work')}>
        <StatePanel
          tone="empty"
          title={empty.title}
          description={empty.description ?? ''}
          actions={
            <S.SecondaryButton to="/contact">
              <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
              Discuss your project
            </S.SecondaryButton>
          }
        />
      </Section>
    )
  }

  return (
    <Section id="work" {...sectionCopy('home', 'work')}>
      <ProjectsCarousel projects={showcaseProjects} />

      <S.Actions>
        <S.ViewAllButton to="/projects">
          <FolderKanban size={18} strokeWidth={2} aria-hidden="true" />
          All projects
        </S.ViewAllButton>
      </S.Actions>
    </Section>
  )
}
