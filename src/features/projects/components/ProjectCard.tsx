import { ArrowUpRight, Globe, Info } from 'lucide-react'
import type { MouseEvent } from 'react'
import type { ShowcaseProject } from '@/features/home/home.data'
import * as S from '@/features/home/sections/styles/projects.styled'

type ProjectCardProps = {
  project: ShowcaseProject
  /** Carousel slides react to the active position; grid cards only to hover. */
  layout: 'carousel' | 'grid' | 'row'
  active?: boolean
  inert?: boolean
  imageLoading?: 'eager' | 'lazy'
  onDetails: (event: MouseEvent<HTMLButtonElement>) => void
}

/**
 * One project card, shared by the homepage carousel and the /projects grid.
 * Carousel cards are image-led with a navy overlay; grid cards are white
 * editorial cards with the photo on top and the copy below; row cards are
 * horizontal thumb-left cards for narrow screens.
 */
export function ProjectCard({
  project,
  layout,
  active = false,
  inert,
  imageLoading = 'lazy',
  onDetails,
}: ProjectCardProps) {
  const ProjectIcon = project.icon
  // Concept projects have no live site yet: preview the first prototype screen
  // until a real URL is added in the admin.
  const websiteHref = project.url ?? project.screenshots[0]?.src ?? null
  const isConcept = project.type === 'concept-demo'

  if (layout === 'grid') {
    return (
      <S.Card $layout={layout} data-layout={layout} inert={inert}>
        <S.GridMedia>
          <S.GridImage
            src={project.image.src}
            alt={project.image.alt}
            width={800}
            height={500}
            loading={imageLoading}
            decoding="async"
          />
          <S.Category>
            <ProjectIcon size={12} strokeWidth={2.5} aria-hidden="true" />
            <S.CategoryLabel>{project.category}</S.CategoryLabel>
          </S.Category>
          {isConcept && <S.ConceptTag>Concept</S.ConceptTag>}
        </S.GridMedia>

        <S.GridBody>
          <S.GridTitle>{project.title}</S.GridTitle>
          <S.GridActions>
            {websiteHref && (
              <S.PrimaryAnchor
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  project.url
                    ? `Visit website: ${project.title} (opens in a new tab)`
                    : `View website prototype: ${project.title} (opens in a new tab)`
                }
                title={project.url ? undefined : 'Prototype preview only'}
              >
                <Globe size={16} strokeWidth={2} aria-hidden="true" />
                Visit
                <S.VisitArrow aria-hidden="true">
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                </S.VisitArrow>
              </S.PrimaryAnchor>
            )}
            <S.GridDetailsButton
              type="button"
              aria-haspopup="dialog"
              aria-label={`Details: ${project.title}`}
              onClick={onDetails}
            >
              <Info size={16} strokeWidth={2} aria-hidden="true" />
              <S.GridDetailsLabel>Details</S.GridDetailsLabel>
            </S.GridDetailsButton>
          </S.GridActions>
        </S.GridBody>
      </S.Card>
    )
  }

  if (layout === 'row') {
    return (
      <S.Card $layout={layout} data-layout={layout} inert={inert}>
        <S.RowInner>
          <S.RowThumb>
            <img
              src={project.image.src}
              alt={project.image.alt}
              width={400}
              height={400}
              loading="lazy"
              decoding="async"
            />
          </S.RowThumb>
          <S.RowContent>
            <S.RowCategory>
              <ProjectIcon size={12} strokeWidth={2.5} aria-hidden="true" />
              {project.category}
            </S.RowCategory>
            <S.RowTitle>{project.title}</S.RowTitle>
            <S.GridActions>
              {websiteHref && (
                <S.PrimaryAnchor
                  href={websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    project.url
                      ? `Visit website: ${project.title} (opens in a new tab)`
                      : `View website prototype: ${project.title} (opens in a new tab)`
                  }
                  title={project.url ? undefined : 'Prototype preview only'}
                >
                  <Globe size={16} strokeWidth={2} aria-hidden="true" />
                  Visit
                  <S.VisitArrow aria-hidden="true">
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </S.VisitArrow>
                </S.PrimaryAnchor>
              )}
              <S.GridDetailsButton
                type="button"
                aria-haspopup="dialog"
                aria-label={`Details: ${project.title}`}
                onClick={onDetails}
              >
                <Info size={16} strokeWidth={2} aria-hidden="true" />
                <S.GridDetailsLabel>Details</S.GridDetailsLabel>
              </S.GridDetailsButton>
            </S.GridActions>
          </S.RowContent>
        </S.RowInner>
      </S.Card>
    )
  }

  return (
    <S.Card
      $layout={layout}
      data-layout={layout}
      data-active={active ? '' : undefined}
      inert={inert}
    >
      <S.CardImage
        src={project.image.src}
        alt={project.image.alt}
        width={800}
        height={800}
        loading={imageLoading}
        decoding="async"
        draggable={false}
      />
      <S.Scrim />
      <S.Category>
        <ProjectIcon size={12} strokeWidth={2.5} aria-hidden="true" />
        <S.CategoryLabel>
          {isConcept ? `Concept · ${project.category}` : project.category}
        </S.CategoryLabel>
      </S.Category>

      <S.Overlay>
        <S.Title>{project.title}</S.Title>
        <S.CardActions>
          {websiteHref && (
            <S.PrimaryAnchor
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                project.url
                  ? `Visit website: ${project.title} (opens in a new tab)`
                  : `View website prototype: ${project.title} (opens in a new tab)`
              }
              title={project.url ? undefined : 'Prototype preview only'}
            >
              <Globe size={16} strokeWidth={2} aria-hidden="true" />
              <S.VisitShort>Visit</S.VisitShort>
              <S.VisitFull>Visit Website</S.VisitFull>
            </S.PrimaryAnchor>
          )}
          <S.DetailsButton
            type="button"
            aria-haspopup="dialog"
            aria-label={`Details: ${project.title}`}
            onClick={onDetails}
          >
            <Info size={16} strokeWidth={2} aria-hidden="true" />
            <S.DetailsLabel>Details</S.DetailsLabel>
          </S.DetailsButton>
        </S.CardActions>
      </S.Overlay>
    </S.Card>
  )
}
