import { FolderKanban, Globe, Info, Layers, MessagesSquare } from 'lucide-react'
import { useState } from 'react'
import type { MouseEvent } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Section } from '@/components/ui/Section'
import { getSection, pageHeader, sectionCopy, seo } from '@/data'
import { showcaseProjects } from '@/features/home/home.data'
import type { ShowcaseProject } from '@/features/home/home.data'
import { ProjectDetails } from '@/features/home/sections/ProjectDetails'
import * as P from '@/features/home/sections/styles/projects.styled'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import * as S from './styles/projects-page.styled'

const ALL = 'All'
const filters = [
  [ALL, Layers] as const,
  ...new Map(showcaseProjects.map((p) => [p.category, p.icon])).entries(),
]

const empty = getSection('projects', 'empty')

export function ProjectsPage() {
  usePageMeta(seo.projects)
  useScrollReveal()

  const [category, setCategory] = useState<string>(ALL)
  const [details, setDetails] = useState<ShowcaseProject | null>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)

  const visible =
    category === ALL
      ? showcaseProjects
      : showcaseProjects.filter((project) => project.category === category)

  const openDetails =
    (project: ShowcaseProject) => (event: MouseEvent<HTMLButtonElement>) => {
      setTrigger(event.currentTarget)
      setDetails(project)
    }

  return (
    <>
      <PageHeader {...pageHeader('projects')} />

      <Section
        id="work"
        {...sectionCopy('projects', 'work')}
      >
        {showcaseProjects.length === 0 ? (
          <S.EmptyState>
            <S.EmptyTitle>{empty.title}</S.EmptyTitle>
            <S.EmptyText>{empty.description}</S.EmptyText>
            <S.PrimaryButton to="/contact">
              <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
              Start a conversation
            </S.PrimaryButton>
          </S.EmptyState>
        ) : (
          <>
            <S.Filters role="group" aria-label="Filter projects by category">
              {filters.map(([name, Icon]) => (
                <S.Chip
                  key={name}
                  type="button"
                  $selected={category === name}
                  aria-pressed={category === name}
                  onClick={() => setCategory(name)}
                >
                  <Icon size={16} strokeWidth={2} aria-hidden="true" />
                  {name}
                </S.Chip>
              ))}
            </S.Filters>

            <S.Grid aria-label="Projects">
              {visible.map((project) => {
                const ProjectIcon = project.icon
                return (
                  <li key={project.id}>
                    <P.Card data-active>
                      <P.CardImage
                        src={project.image.src}
                        alt={project.image.alt}
                        width={800}
                        height={800}
                        loading="lazy"
                        decoding="async"
                      />
                      <P.Scrim />
                      <P.Category>
                        <ProjectIcon
                          size={12}
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <P.CategoryLabel>
                          {project.type === 'concept-demo' ? `Concept · ${project.category}` : project.category}
                        </P.CategoryLabel>
                      </P.Category>
                      <P.Overlay>
                        <P.Title>{project.title}</P.Title>
                        <P.Summary>{project.summary}</P.Summary>
                        <P.CardActions>
                          {project.url && (
                            <P.PrimaryAnchor
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit website: ${project.title} (opens in a new tab)`}
                            >
                              <Globe size={16} strokeWidth={2} aria-hidden="true" />
                              <P.VisitShort>Visit</P.VisitShort>
                              <P.VisitFull>Visit Website</P.VisitFull>
                            </P.PrimaryAnchor>
                          )}
                          <P.DetailsButton
                            type="button"
                            aria-haspopup="dialog"
                            aria-label={`Details: ${project.title}`}
                            onClick={openDetails(project)}
                          >
                            <Info size={16} strokeWidth={2} aria-hidden="true" />
                            <P.DetailsLabel>Details</P.DetailsLabel>
                          </P.DetailsButton>
                        </P.CardActions>
                      </P.Overlay>
                    </P.Card>
                  </li>
                )
              })}
            </S.Grid>
          </>
        )}
      </Section>

      <Section
        id="start"
        {...sectionCopy('projects', 'start')}
      >
        <S.PrimaryButton to="/contact">
          <FolderKanban size={18} strokeWidth={2} aria-hidden="true" />
          Start a project
        </S.PrimaryButton>
      </Section>

      {details && (
        <ProjectDetails
          key={details.id}
          project={details}
          onClose={() => setDetails(null)}
          returnFocusTo={trigger}
        />
      )}
    </>
  )
}
