import {
  SkeletonButton,
  SkeletonCircle,
  SkeletonLine,
  SkeletonPage,
  SkeletonPill,
} from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonCta,
  SkeletonPageHero,
  SkeletonSectionHead,
} from '@/components/skeletons/SkeletonSections'
import * as Section from '@/components/ui/styles/section.styled'
import * as Project from '@/features/home/sections/styles/projects.styled'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import * as S from '../styles/projects-page.styled'

// Seven chips: All plus the six categories. The longer widths push the last
// chip onto a second row at 768, matching the real toolbar's wrap.
const filterChips = [
  { id: 'all', width: '4.5rem' },
  { id: 'management', width: '6.5rem' },
  { id: 'booking', width: '6rem' },
  { id: 'inventory', width: '6.5rem' },
  { id: 'crm', width: '5rem' },
  { id: 'dashboards', width: '7rem' },
  { id: 'websites', width: '6rem' },
]
const carouselOffsets = [-2, -1, 0, 1, 2]

/**
 * Projects page skeleton: hero, work section head, the category filter bar,
 * the collapsed carousel, and the closing CTA. The filter switches to the
 * mobile segmented bar at the same breakpoint as the real page.
 */
export function ProjectsSkeleton() {
  const isMobile = useMediaQuery('(max-width: 47.9375rem)')

  return (
    <SkeletonPage label="Loading projects page">
      <SkeletonPageHero />

      <Section.Wrapper>
        <SkeletonSectionHead />

        {isMobile ? (
          <S.Segmented>
            <S.SegmentAll as="div" $active={false}>
              <SkeletonLine $w="3.5rem" $h="0.75rem" $tone="muted" />
            </S.SegmentAll>
            <S.SegmentCategories as="div" $active={false}>
              <SkeletonLine $w="5.5rem" $h="0.75rem" $tone="muted" />
            </S.SegmentCategories>
            <S.FilterToggle as="div" />
          </S.Segmented>
        ) : (
          <S.Filters>
            <S.FilterTop>
              <S.FilterLabel>
                <SkeletonLine $w="5rem" $h="0.75rem" />
              </S.FilterLabel>
              <S.FilterToggle as="div" />
            </S.FilterTop>
            <S.FilterChips>
              {filterChips.map(({ id, width }) => (
                <S.Chip key={id} as="div" $selected={false}>
                  <SkeletonLine $w={width} $h="0.75rem" $tone="muted" />
                </S.Chip>
              ))}
            </S.FilterChips>
          </S.Filters>
        )}

        <Project.Carousel data-revealed>
          <Project.Stage>
            {carouselOffsets.map((offset) => (
              <Project.Slide key={offset} $offset={offset} $instant>
                <Project.Card as="div" $layout="carousel">
                  <Project.Overlay>
                    <SkeletonPill $w="65%" $tone="dark" />
                    <SkeletonLine $w="85%" $h="1.25rem" $tone="dark" />
                    <SkeletonLine $w="70%" $h="0.75rem" $tone="dark" />
                    <Project.CardActions>
                      <SkeletonButton $w="45%" $tone="dark" />
                      <SkeletonButton $w="45%" $tone="dark" />
                    </Project.CardActions>
                  </Project.Overlay>
                </Project.Card>
              </Project.Slide>
            ))}
          </Project.Stage>
          <Project.Controls>
            <SkeletonCircle $size="2.75rem" />
            <SkeletonCircle $size="2.75rem" />
          </Project.Controls>
        </Project.Carousel>
      </Section.Wrapper>

      <SkeletonCta />
    </SkeletonPage>
  )
}
