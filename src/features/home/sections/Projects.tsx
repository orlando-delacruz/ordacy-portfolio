import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  MessagesSquare,
} from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { Lightbox } from '../components/Lightbox'
import { Section } from '../components/Section'
import type { ShowcaseProject } from '../home.data'
import { showcaseProjects } from '../home.data'
import * as S from './styles/projects.styled'

const count = showcaseProjects.length
const SWIPE_THRESHOLD = 40

/** Signed shortest distance from `active` to `index` around the loop. */
function loopOffset(index: number, active: number) {
  let offset = index - active
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

export function Projects() {
  // `previous` lets each card tell when it wrapped around the loop, so it can snap instead of sliding.
  const [{ active, previous }, setPosition] = useState({
    active: 0,
    previous: 0,
  })
  const [details, setDetails] = useState<ShowcaseProject | null>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const pointerStart = useRef<number | null>(null)
  const swiped = useRef(false)

  const goTo = (index: number) =>
    setPosition((current) => ({
      active: ((index % count) + count) % count,
      previous: current.active,
    }))
  const step = (delta: number) => goTo(active + delta)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') step(-1)
    else if (event.key === 'ArrowRight') step(1)
    else return
    event.preventDefault()
  }

  const handlePointerDown = (event: PointerEvent) => {
    pointerStart.current = event.clientX
    swiped.current = false
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (pointerStart.current === null) return
    const distance = event.clientX - pointerStart.current
    pointerStart.current = null
    if (Math.abs(distance) < SWIPE_THRESHOLD) return
    swiped.current = true
    step(distance < 0 ? 1 : -1)
  }

  const openDetails =
    (project: ShowcaseProject) => (event: MouseEvent<HTMLButtonElement>) => {
      setTrigger(event.currentTarget)
      setDetails(project)
    }

  const current = showcaseProjects[active]

  return (
    <Section
      id="work"
      title="Real Business Solutions."
      description="Selected work, shared with permission."
    >
      <S.Carousel
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <S.Stage
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => (pointerStart.current = null)}
          onClickCapture={(event) => {
            // A swipe ends with a click; don't let it also select a side card.
            if (swiped.current) {
              event.stopPropagation()
              swiped.current = false
            }
          }}
        >
          {showcaseProjects.map((project, index) => {
            const offset = loopOffset(index, active)
            const wrapped =
              Math.abs(offset - loopOffset(index, previous)) > 1
            const isActive = offset === 0

            return (
              <S.Slide
                key={project.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${project.title}`}
                aria-hidden={!isActive}
                $offset={offset}
                $instant={wrapped}
                onClick={isActive ? undefined : () => goTo(index)}
              >
                <S.Card inert={!isActive}>
                  <S.CardImage
                    src={project.image.src}
                    alt={project.image.alt}
                    width={800}
                    height={800}
                    loading={Math.abs(offset) <= 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                  <S.Scrim />
                  <S.Category>{project.category}</S.Category>

                  <S.Overlay>
                    <S.Title>{project.title}</S.Title>
                    <S.Summary>{project.summary}</S.Summary>
                    <S.CardActions>
                      {/* Labels shorten on narrow cards; aria-labels keep the full name and start with the visible words. */}
                      <S.PrimaryAnchor
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit website: ${project.title} (opens in a new tab)`}
                      >
                        <S.LabelWide>Visit website</S.LabelWide>
                        <S.LabelNarrow>Visit</S.LabelNarrow>
                        <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                      </S.PrimaryAnchor>
                      <S.DetailsButton
                        type="button"
                        aria-haspopup="dialog"
                        aria-label={`Details: ${project.title}`}
                        onClick={openDetails(project)}
                      >
                        <S.LabelWide>Details</S.LabelWide>
                        <S.LabelNarrow>
                          <Info size={18} strokeWidth={2} aria-hidden="true" />
                        </S.LabelNarrow>
                      </S.DetailsButton>
                    </S.CardActions>
                  </S.Overlay>
                </S.Card>
              </S.Slide>
            )
          })}
        </S.Stage>

        <S.Controls>
          <S.ArrowButton
            type="button"
            aria-label="Previous project"
            onClick={() => step(-1)}
          >
            <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
          </S.ArrowButton>

          <S.Dots>
            {showcaseProjects.map((project, index) => (
              <S.Dot
                key={project.id}
                type="button"
                aria-label={`Show project ${index + 1}: ${project.title}`}
                aria-current={index === active}
                $active={index === active}
                onClick={() => goTo(index)}
              />
            ))}
          </S.Dots>

          <S.ArrowButton
            type="button"
            aria-label="Next project"
            onClick={() => step(1)}
          >
            <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
          </S.ArrowButton>
        </S.Controls>

        <S.SrOnly aria-live="polite">
          Project {active + 1} of {count}: {current.title}
        </S.SrOnly>
      </S.Carousel>

      <S.Actions>
        <S.SecondaryButton to="/projects">View All Projects</S.SecondaryButton>
      </S.Actions>

      {details && (
        <Lightbox
          title={details.title}
          closeLabel="Close project details"
          onClose={() => setDetails(null)}
          returnFocusTo={trigger}
        >
          <S.Detail>
            <S.DetailMedia>
              <S.Image
                src={details.image.src}
                alt={details.image.alt}
                width={1200}
                height={750}
              />
            </S.DetailMedia>

            <S.DetailContent>
              <S.DetailCategory>{details.category}</S.DetailCategory>
              <S.DetailText>{details.details}</S.DetailText>

              <S.FeatureHeading>What it includes</S.FeatureHeading>
              <S.FeatureList>
                {details.features.map((feature) => (
                  <S.FeatureItem key={feature}>
                    <S.FeatureIcon>
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                    </S.FeatureIcon>
                    {feature}
                  </S.FeatureItem>
                ))}
              </S.FeatureList>

              <S.DetailActions>
                <S.PrimaryAnchor
                  href={details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                  <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />
                  <S.SrOnly> (opens in a new tab)</S.SrOnly>
                </S.PrimaryAnchor>
                <S.SecondaryButton to="/contact">
                  <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
                  Discuss a similar project
                </S.SecondaryButton>
              </S.DetailActions>
            </S.DetailContent>
          </S.Detail>
        </Lightbox>
      )}
    </Section>
  )
}
