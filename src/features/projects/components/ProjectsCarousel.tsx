import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import type { ShowcaseProject } from '@/features/home/home.data'
import { ProjectDetails } from '@/features/home/sections/ProjectDetails'
import * as S from '@/features/home/sections/styles/projects.styled'
import { ProjectCard } from './ProjectCard'

const SWIPE_THRESHOLD = 40

/** Signed shortest distance from `active` to `index` around the loop. */
function loopOffset(index: number, active: number, count: number) {
  let offset = index - active
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

type ProjectsCarouselProps = {
  projects: readonly ShowcaseProject[]
  /** Accessible name for the carousel region. */
  label?: string
}

/**
 * The homepage's 3D project carousel. Shared so the projects index can show
 * the same layout in its collapsed state.
 */
export function ProjectsCarousel({
  projects,
  label = 'Featured projects',
}: ProjectsCarouselProps) {
  const count = projects.length
  // `previous` lets each card tell when it wrapped around the loop, so it can
  // snap instead of sliding.
  const [{ active, previous }, setPosition] = useState({
    active: 0,
    previous: 0,
  })
  const [details, setDetails] = useState<ShowcaseProject | null>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const pointerStart = useRef<number | null>(null)
  const swiped = useRef(false)
  // Cards fan out from the centre the first time the carousel scrolls into view.
  const [carouselRef, revealed] = useRevealOnce<HTMLDivElement>(0.2)

  if (count === 0) return null

  const goTo = (index: number) =>
    setPosition((current) => ({
      active: ((index % count) + count) % count,
      previous: current.active,
    }))
  const step = (delta: number) => goTo(active + delta)
  const navigable = count > 1

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

  const current = projects[active] ?? projects[0]

  return (
    <>
      <S.Carousel
        ref={carouselRef}
        data-revealed={revealed || undefined}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={navigable ? 0 : -1}
        onKeyDown={navigable ? handleKeyDown : undefined}
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
          {projects.map((project, index) => {
            const offset = loopOffset(index, active, count)
            const wrapped =
              Math.abs(offset - loopOffset(index, previous, count)) > 1
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
                <ProjectCard
                  project={project}
                  layout="carousel"
                  active={isActive}
                  inert={!isActive}
                  imageLoading={Math.abs(offset) <= 2 ? 'eager' : 'lazy'}
                  onDetails={openDetails(project)}
                />
              </S.Slide>
            )
          })}
        </S.Stage>

        {navigable && (
          <S.Controls>
            <S.ArrowButton
              type="button"
              aria-label="Previous project"
              onClick={() => step(-1)}
            >
              <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
            </S.ArrowButton>

            <S.ArrowButton
              type="button"
              aria-label="Next project"
              onClick={() => step(1)}
            >
              <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
            </S.ArrowButton>
          </S.Controls>
        )}

        <S.SrOnly aria-live="polite">
          Project {active + 1} of {count}: {current?.title}
        </S.SrOnly>
      </S.Carousel>

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

