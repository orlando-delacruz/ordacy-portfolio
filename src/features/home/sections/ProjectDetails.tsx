import { Check, Globe, MessagesSquare } from 'lucide-react'
import { useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'
import type { ShowcaseProject } from '../home.data'
import * as S from './styles/projects.styled'

type ProjectDetailsProps = {
  project: ShowcaseProject
  onClose: () => void
  returnFocusTo: HTMLButtonElement | null
}

/** Project details dialog, shared by the home carousel and the /projects grid. */
export function ProjectDetails({
  project,
  onClose,
  returnFocusTo,
}: ProjectDetailsProps) {
  const [selectedShot, setSelectedShot] = useState(0)
  // Gallery starts with the thumbnail, followed by the extra screenshots.
  const gallery = [project.image, ...project.screenshots]
  const activeShot = gallery[selectedShot] ?? project.image

  return (
    <Lightbox
      title={project.title}
      closeLabel="Close project details"
      onClose={onClose}
      returnFocusTo={returnFocusTo}
    >
      <S.Detail>
        <S.DetailGallery>
          <S.DetailMedia>
            <S.Image
              key={activeShot.src}
              src={activeShot.src}
              alt={activeShot.alt}
              width={1200}
              height={750}
            />
          </S.DetailMedia>

          <S.DetailThumbs role="group" aria-label="Project images">
            {gallery.map((shot, index) => (
              <S.DetailThumb
                key={shot.src}
                type="button"
                $active={index === selectedShot}
                aria-pressed={index === selectedShot}
                aria-label={`View image ${index + 1}: ${shot.alt}`}
                onClick={() => setSelectedShot(index)}
              >
                <S.Image
                  src={shot.src}
                  alt=""
                  width={400}
                  height={250}
                  loading="lazy"
                  decoding="async"
                />
              </S.DetailThumb>
            ))}
          </S.DetailThumbs>
        </S.DetailGallery>

        <S.DetailContent>
          <S.DetailCategory>
            {project.type === 'concept-demo'
              ? `Concept demo · ${project.category}`
              : project.category}
          </S.DetailCategory>
          {/* Same description as the project card. */}
          <S.DetailText>{project.summary}</S.DetailText>

          {project.details && <S.DetailText>{project.details}</S.DetailText>}

          {project.challenge && (
            <>
              <S.FeatureHeading>The challenge</S.FeatureHeading>
              <S.DetailText>{project.challenge}</S.DetailText>
            </>
          )}

          {project.solution && (
            <>
              <S.FeatureHeading>The solution</S.FeatureHeading>
              <S.DetailText>{project.solution}</S.DetailText>
            </>
          )}

          <S.FeatureHeading>What it includes</S.FeatureHeading>
          <S.FeatureList>
            {project.features.map((feature) => (
              <S.FeatureItem key={feature}>
                <S.FeatureIcon>
                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                </S.FeatureIcon>
                {feature}
              </S.FeatureItem>
            ))}
          </S.FeatureList>

          <S.DetailActions>
            {project.url && (
              <S.PrimaryAnchor
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={18} strokeWidth={2} aria-hidden="true" />
                Visit website
                <S.SrOnly> (opens in a new tab)</S.SrOnly>
              </S.PrimaryAnchor>
            )}
            <S.SecondaryButton to="/contact">
              <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
              Discuss Same Project
            </S.SecondaryButton>
          </S.DetailActions>
        </S.DetailContent>
      </S.Detail>
    </Lightbox>
  )
}
