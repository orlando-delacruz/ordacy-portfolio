import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Layers,
  Maximize2,
  Minimize2,
  Rocket,
  SlidersHorizontal,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { PageState } from '@/components/state/PageState'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { ClosingCta } from '@/components/ui/ClosingCta'
import * as Hero from '@/components/ui/styles/page-hero.styled'
import { closingCta, pageHeader, sectionCopy, seo } from '@/data'
import { showcaseProjects } from '@/features/home/home.data'
import type { ShowcaseProject } from '@/features/home/home.data'
import { ProjectDetails } from '@/features/home/sections/ProjectDetails'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ProjectCard } from './components/ProjectCard'
import { ProjectsCarousel } from './components/ProjectsCarousel'
import { ProjectsSkeleton } from './skeletons/ProjectsSkeleton'
import * as S from './styles/projects-page.styled'

const ALL = 'All'
const count = showcaseProjects.length
const header = pageHeader('projects')
const startCta = closingCta('projects', 'start')

// The H1's second line renders in teal; everything before it stays white.
const TEAL_PHRASE = 'real business needs.'

// Each chip carries a live count from the published projects.
const categoryFilters = Array.from(
  new Map(
    showcaseProjects.map((project) => [project.category, project.icon]),
  ).entries(),
)
const filters: ReadonlyArray<readonly [string, LucideIcon, number]> = [
  [ALL, Layers, count],
  ...categoryFilters.map(
    ([category, icon]) =>
      [
        category,
        icon,
        showcaseProjects.filter((project) => project.category === category)
          .length,
      ] as const,
  ),
]

const MOBILE_PAGE_SIZE = 3

export function ProjectsPage() {
  usePageMeta(seo.projects)
  useScrollReveal()

  const isMobile = useMediaQuery('(max-width: 47.9375rem)')
  const [category, setCategory] = useState<string>(ALL)
  const [page, setPage] = useState(1)
  const [menuOpen, setMenuOpen] = useState(false)
  // Collapsed by default: the homepage carousel; Expand reveals the full index.
  const [expanded, setExpanded] = useState(false)
  const [details, setDetails] = useState<ShowcaseProject | null>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const disclosureRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

  const selectCategory = (name: string) => {
    setCategory(name)
    setPage(1)
    setMenuOpen(false)
  }

  const closeMenu = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && menuOpen) {
      setMenuOpen(false)
      disclosureRef.current?.focus()
    }
  }

  const visible =
    category === ALL
      ? showcaseProjects
      : showcaseProjects.filter((project) => project.category === category)

  const totalPages = Math.max(
    1,
    Math.ceil(visible.length / MOBILE_PAGE_SIZE),
  )
  const currentPage = Math.min(page, totalPages)
  const paged = visible.slice(
    (currentPage - 1) * MOBILE_PAGE_SIZE,
    currentPage * MOBILE_PAGE_SIZE,
  )
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  )

  const goToPage = (next: number) => {
    setPage(next)
    document.getElementById('projects-view')?.scrollIntoView()
  }

  const toggleView = () => setExpanded((current) => !current)

  // Icon-only view toggle shared by the desktop chip row and the mobile
  // segmented bar. No visible label by design; the accessible name carries it.
  const viewToggle = (
    <S.FilterToggle
      type="button"
      aria-expanded={expanded}
      aria-controls="projects-view"
      aria-label={expanded ? 'Collapse projects' : 'Expand projects'}
      title={expanded ? 'Collapse' : 'Expand'}
      onClick={toggleView}
    >
      {expanded ? (
        <Minimize2 size={20} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Maximize2 size={20} strokeWidth={2} aria-hidden="true" />
      )}
    </S.FilterToggle>
  )

  const announcement =
    category === ALL
      ? `All ${count} projects shown`
      : `${visible.length} of ${count} projects shown`

  // Keyed so the swap between carousel and index replays the entrance.
  const viewKey = `view-${expanded ? 'grid' : 'carousel'}-${category}-${
    expanded && isMobile ? currentPage : 0
  }`

  const openDetails =
    (project: ShowcaseProject) => (event: MouseEvent<HTMLButtonElement>) => {
      setTrigger(event.currentTarget)
      setDetails(project)
    }

  return (
    <>
      <PageState
        page="projects"
        empty={count === 0}
        hero={
          <PageHero
            titleId="projects-title"
            eyebrow={header.eyebrow}
            badgeIcon={FolderKanban}
            title={header.title}
            accent={TEAL_PHRASE}
            description={header.description}
            actions={
              <>
                <Hero.PrimaryButton to="/contact">
                  <Rocket size={18} strokeWidth={2} aria-hidden="true" />
                  Get started
                </Hero.PrimaryButton>
                <Hero.GhostButton to="/about-us#services">
                  <Layers size={18} strokeWidth={2} aria-hidden="true" />
                  View services
                </Hero.GhostButton>
              </>
            }
          />
        }
        skeleton={<ProjectsSkeleton />}
      >
        <Section id="work" {...sectionCopy('projects', 'work')}>
          {isMobile ? (
            <S.Segmented ref={barRef} onKeyDown={closeMenu}>
              <S.SegmentAll
                type="button"
                $active={category === ALL}
                aria-pressed={category === ALL}
                onClick={() => selectCategory(ALL)}
              >
                <Layers size={18} strokeWidth={2} aria-hidden="true" />
                All ({count})
              </S.SegmentAll>
              <S.SegmentCategories
                ref={disclosureRef}
                type="button"
                $active={category !== ALL}
                aria-pressed={category !== ALL}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                Categories
                <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
              </S.SegmentCategories>
              {viewToggle}
              {menuOpen && (
                <S.FilterMenu role="menu" aria-label="Project categories">
                  {filters.map(([name, Icon, total]) => (
                    <S.FilterMenuItem
                      key={name}
                      type="button"
                      role="menuitemradio"
                      aria-checked={category === name}
                      $selected={category === name}
                      onClick={() => selectCategory(name)}
                    >
                      <Icon size={16} strokeWidth={2} aria-hidden="true" />
                      {name}
                      <S.ChipCount>{total}</S.ChipCount>
                    </S.FilterMenuItem>
                  ))}
                </S.FilterMenu>
              )}
            </S.Segmented>
          ) : (
            <S.Filters role="group" aria-label="Filter projects by category">
              <S.FilterTop>
                <S.FilterLabel>
                  <SlidersHorizontal
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Category
                </S.FilterLabel>
                {viewToggle}
              </S.FilterTop>
              <S.FilterChips>
                {filters.map(([name, Icon, total]) => (
                  <S.Chip
                    key={name}
                    type="button"
                    $selected={category === name}
                    aria-pressed={category === name}
                    onClick={() => selectCategory(name)}
                  >
                    <Icon size={16} strokeWidth={2} aria-hidden="true" />
                    {name}
                    <S.ChipCount>{total}</S.ChipCount>
                  </S.Chip>
                ))}
              </S.FilterChips>
            </S.Filters>
          )}
          <S.SrOnly aria-live="polite">{announcement}</S.SrOnly>

          <S.View key={viewKey} id="projects-view">
            {!expanded ? (
              <ProjectsCarousel
                projects={visible}
                label="Concept projects carousel"
              />
            ) : isMobile ? (
              <>
                <S.RowList aria-label="Projects">
                  {paged.map((project) => (
                    <li key={project.id}>
                      <ProjectCard
                        project={project}
                        layout="row"
                        onDetails={openDetails(project)}
                      />
                    </li>
                  ))}
                </S.RowList>

                <S.Pagination aria-label="Projects pages">
                  <S.PageButton
                    type="button"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    aria-disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    <ChevronLeft
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </S.PageButton>
                  {pageNumbers.map((number) => (
                    <S.PageButton
                      key={number}
                      type="button"
                      aria-label={`Page ${number}`}
                      aria-current={number === currentPage ? 'page' : undefined}
                      $active={number === currentPage}
                      onClick={() => goToPage(number)}
                    >
                      {number}
                    </S.PageButton>
                  ))}
                  <S.PageButton
                    type="button"
                    aria-label="Next page"
                    disabled={currentPage === totalPages}
                    aria-disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </S.PageButton>
                </S.Pagination>
              </>
            ) : (
              <S.Grid aria-label="Projects">
                {visible.map((project) => (
                  <li key={project.id}>
                    <ProjectCard
                      project={project}
                      layout="grid"
                      onDetails={openDetails(project)}
                    />
                  </li>
                ))}
              </S.Grid>
            )}
          </S.View>
        </Section>

        <ClosingCta id="start" titleId="start-title" {...startCta} />
      </PageState>

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
