import styled, { css, keyframes } from 'styled-components'

/*
 * The public skeletons. One shared pulse owns the loading feel; reduced motion
 * removes it and leaves the same shapes, static.
 */
const pulse = keyframes`
  0% {
    opacity: 0.55;
  }
  100% {
    opacity: 0.9;
  }
`

export const pulsing = css`
  animation: ${pulse} 1.6s ease-in-out infinite alternate;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export type SkeletonTone = 'default' | 'dark' | 'muted'

/* ---------- Primitives ---------- */

export const Block = styled.div<{
  $w?: string
  $h?: string
  $r?: string
  $tone?: SkeletonTone
}>`
  width: ${({ $w = '100%' }) => $w};
  height: ${({ $h = '1rem' }) => $h};
  border-radius: ${({ $r, theme }) => $r ?? theme.radii.sm};
  background: ${({ $tone, theme }) => {
    if ($tone === 'dark') return 'rgba(254, 254, 254, 0.1)'
    if ($tone === 'muted') return theme.colors.border.default
    return theme.colors.background.subtle
  }};
  ${pulsing}
`

export const Line = styled(Block)<{ $h?: string }>`
  height: ${({ $h = '0.875rem' }) => $h}; /* grid-exempt: optical text line */
  border-radius: ${({ theme }) => theme.radii.pill};
`

export const Circle = styled(Block)<{ $size?: string }>`
  width: ${({ $size = '3rem' }) => $size};
  height: ${({ $size = '3rem' }) => $size};
  border-radius: ${({ theme }) => theme.radii.round};
`

export const ButtonBlock = styled(Block)<{ $w?: string }>`
  width: ${({ $w = '100%' }) => $w};
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
`

export const PillBlock = styled(Block)<{ $w?: string }>`
  width: ${({ $w = '6rem' }) => $w};
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radii.pill};
`

export const Card = styled.div<{ $pad?: string }>`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  padding: ${({ $pad, theme }) => $pad ?? theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const Section = styled.section`
  min-width: 0;
  padding-block: 2.5rem;
`

export const SectionHead = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 44rem;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`

/* A section head with a control beside it (the pricing currency toggle). */
export const SectionHeadRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`

export const SectionHeadText = styled.div`
  display: grid;
  flex: 1 1 18rem;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
  max-width: 44rem;
`

export const TogglePlaceholder = styled.div`
  display: inline-flex;
  flex: none;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
`

/* ---------- Shared page hero ---------- */

export const Hero = styled.section`
  margin-top: calc(-1 * ${({ theme }) => theme.spacing.xl});
`

export const HeroBand = styled.div`
  position: relative;
  margin-inline: calc(-1 * ${({ theme }) => theme.spacing.lg});
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  background:
    radial-gradient(
      60rem 30rem at 85% 20%,
      color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 12%, transparent),
      transparent 62%
    ),
    ${({ theme }) => theme.colors.brand.navy};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['2xl']}
      ${({ theme }) => theme.spacing.xl};
    border-bottom-left-radius: ${({ theme }) => theme.radii.md};
    border-bottom-right-radius: ${({ theme }) => theme.radii.md};
  }
`

export const HeroInner = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  /* The band stays wide; the copy column matches the real 36rem hero copy. */
  grid-template-columns: minmax(0, 36rem);
  justify-items: start;
  max-width: 70rem;
  min-width: 0;
  margin-inline: auto;
`

export const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  max-width: 24rem;
  margin-top: ${({ theme }) => theme.spacing.xs};

  & > * {
    flex: 1 1 0;
    min-width: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    & > * {
      flex: 0 0 auto;
      width: 9rem;
    }
  }
`

/* ---------- Home profile hero ---------- */

export const HomeHero = styled.section`
  margin-top: calc(
    -1 * var(--top-bar-height) - ${({ theme }) => theme.spacing.xl}
  );
  padding-top: var(--top-bar-height);
  padding-bottom: 2.5rem;
`

export const HomeCover = styled.div`
  min-height: 12rem;
  margin-inline: calc(-1 * ${({ theme }) => theme.spacing.lg});
  background:
    radial-gradient(
      42rem 22rem at 85% 25%,
      color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 14%, transparent),
      transparent 65%
    ),
    ${({ theme }) => theme.colors.brand.navy};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: clamp(17rem, 34vw, 30rem);
    border-bottom-left-radius: ${({ theme }) => theme.radii.md};
    border-bottom-right-radius: ${({ theme }) => theme.radii.md};
  }
`

export const HomeProfile = styled.div`
  display: grid;
  grid-template-areas:
    'avatar'
    'identity'
    'actions';
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      'avatar identity'
      'avatar actions';
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.lg};
    padding-inline: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: 'avatar identity actions';
  }
`

export const HomeAvatar = styled.div`
  grid-area: avatar;
  width: 7.5rem;
  height: 7.5rem;
  margin-top: -3.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.default};
  ${pulsing}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 9rem;
    height: 9rem;
    margin-top: 0;
  }
`

export const HomeIdentity = styled.div`
  display: grid;
  grid-area: identity;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  min-width: 0;
`

export const HomeStats = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

export const HomeStat = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const HomeActions = styled.div`
  display: flex;
  grid-area: actions;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;

  & > * {
    flex: 1 1 5rem;
    min-width: 0;
  }
`

export const HomeLike = styled(Block)`
  && {
    flex: 0 0 2.75rem;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: ${({ theme }) => theme.radii.md};
  }
`

export const HomeTeam = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-inline: ${({ theme }) => theme.spacing.xl};
  }
`

export const TeamGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }
`

export const TeamCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`

export const TeamAvatar = styled.div`
  flex: none;
  width: 6rem;
  height: 6rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  ${pulsing}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 7rem;
    height: 7rem;
  }
`

export const TeamBody = styled.div`
  display: grid;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

/* ---------- Generic card grid ---------- */

export const CardGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

export const GridCard = styled.div`
  display: grid;
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const CardMedia = styled.div`
  aspect-ratio: 16 / 10;
  background: ${({ theme }) => theme.colors.background.subtle};
  ${pulsing}
`

export const CardBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
`

export const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};

  & > * {
    flex: 1 1 0;
    min-width: 0;
  }
`

/* ---------- Plan cards ---------- */

export const PlanGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    flex: 0 0 15rem;
    scroll-snap-align: start;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    & > * {
      flex-basis: 18rem;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    & > * {
      flex-basis: 20rem;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding-block: 0;
    overflow: visible;
    scroll-snap-type: none;

    & > * {
      flex: initial;
    }
  }
`

export const PlanCard = styled.div`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

export const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

export const PlanIcon = styled.div`
  flex: none;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  ${pulsing}
`

export const PlanName = styled.div`
  display: grid;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const PriceBlock = styled.div`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const FitList = styled.div`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const FitRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const FitDot = styled.div`
  flex: none;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  ${pulsing}
`

export const HelpStrip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.background.subtle};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  }
`

export const HelpBody = styled.div`
  display: grid;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 1;
    width: auto;
  }
`

/* ---------- Project carousel ---------- */

export const CarouselStage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  padding-block: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
`

export const CarouselSide = styled.div`
  flex: none;
  width: 18%;
  aspect-ratio: 3 / 5;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.background.subtle};
  opacity: 0.45;
  ${pulsing}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: min(28%, 19rem);
    opacity: 0.62;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: min(24%, 19rem);
    aspect-ratio: 1;
  }
`

export const CarouselMain = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: min(58%, 22rem);
  aspect-ratio: 3 / 5;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.brand.navy};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: min(36%, 20rem);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: min(28%, 19rem);
    aspect-ratio: 1;
  }
`

export const CarouselMainBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
`

export const CarouselActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  & > * {
    flex: 1 1 0;
    min-width: 0;
  }
`

export const ViewAll = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`

/* ---------- FAQ workspace ---------- */

export const FaqWorkspace = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: 18rem minmax(0, 1fr);
    column-gap: ${({ theme }) => theme.spacing['3xl']};
    align-items: start;
  }
`

export const FaqRail = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`

export const FaqTools = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

export const FaqSearch = styled.div`
  width: 100%;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.subtle};
  ${pulsing}
`

export const FaqTopics = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: grid;
    gap: 2px; /* grid-exempt: optical row hairline */
    padding-bottom: 0;
    overflow: visible;
  }
`

export const FaqTopic = styled(Block)`
  flex: none;
  width: ${({ $w = '6rem' }) => $w};
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.pill};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 100%;
  }
`

export const FaqAsk = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: grid;
    justify-items: start;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.lg};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.surface.default};
  }
`

export const FaqAskIcon = styled(Block)`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
`

export const FaqResults = styled.div`
  min-width: 0;
`

export const FaqResultRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

export const FaqList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const FaqItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.lg} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const FaqQuestion = styled.div`
  flex: 1;
  min-width: 0;
`

export const FaqToggle = styled.div`
  flex: none;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  ${pulsing}
`

/* ---------- Testimonial cards ---------- */

export const TestimonialGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const TestimonialCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const TestimonialTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 1.5rem;
`

export const TestimonialQuote = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const TestimonialAuthorBody = styled.div`
  display: grid;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`

export const PaginationDot = styled(Block)`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.round};
`

/* ---------- Plan comparison ---------- */

export const CompareStack = styled.div`
  display: grid;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: none;
  }
`

export const ComparePlan = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const ComparePlanHead = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ComparePlanDetails = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

export const CompareRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 8rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
    align-items: start;
  }
`

export const CompareTable = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    display: block;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.surface.default};
  }
`

export const CompareTableHead = styled.div`
  display: grid;
  grid-template-columns: 11rem repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const CompareTableRow = styled.div`
  display: grid;
  grid-template-columns: 11rem repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};

  &:last-child {
    border-bottom: 0;
  }
`

export const CompareTableCell = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`

/* ---------- Contact form ---------- */

export const ContactCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 1.5rem;
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

export const ContactHeader = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;
`

export const ContactIcon = styled(Block)`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.md};
`

export const ContactHeaderBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const ContactForm = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  min-width: 0;
`

export const FieldRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const Control = styled(Block)`
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const Textarea = styled(Block)`
  height: 7rem;
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const Submit = styled(Block)`
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const NoteLine = styled.div`
  display: flex;
  justify-content: center;
`

/* ---------- Legal document ---------- */

export const LegalDoc = styled.div`
  padding-top: 2.5rem;
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
`

export const LegalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const LegalMetaAction = styled(Block)`
  width: 6rem;
  height: 2.75rem;
  margin-left: auto;
  border-radius: ${({ theme }) => theme.radii.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    margin-left: 0;
  }
`

export const LegalLayout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 14rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing['2xl']};
    align-items: start;
  }
`

export const LegalToc = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const LegalTocList = styled.div`
  display: grid;
  gap: 2px; /* grid-exempt: optical row hairline */
  margin-top: ${({ theme }) => theme.spacing.sm};
`

export const LegalTocItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.75rem;
  padding-inline: ${({ theme }) => theme.spacing.sm};
`

export const LegalTocNumber = styled(Block)`
  flex: none;
  width: 1rem;
  height: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const LegalTocLabel = styled.div`
  flex: 1;
  min-width: 0;
`

export const LegalBody = styled.div`
  display: grid;
  min-width: 0;
  max-width: 44rem;
`

export const LegalLead = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

export const LegalSection = styled.section`
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};

  &:first-of-type {
    padding-top: 0;
    border-top: 0;
  }

  & + & {
    margin-top: ${({ theme }) => theme.spacing.xl};
  }
`

export const LegalHeadingRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const LegalSectionNumber = styled(Block)`
  flex: none;
  width: 1.5rem;
  height: 0.75rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const LegalSectionTitle = styled.div`
  flex: 1;
  min-width: 0;
`

export const LegalSectionBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`

/* ---------- Team profile ---------- */

export const ProfileStrip = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    'avatar role'
    'facts facts'
    'actions actions';
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding-block: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      'avatar role actions'
      'avatar facts actions';
    gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  }
`

export const ProfileAvatar = styled.div`
  grid-area: avatar;
  width: 7.5rem;
  height: 7.5rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  ${pulsing}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 9rem;
    height: 9rem;
  }
`

export const ProfileRole = styled.div`
  display: grid;
  grid-area: role;
  gap: ${({ theme }) => theme.spacing.xs};
  align-content: start;
  min-width: 0;
`

export const ProfileFacts = styled.div`
  display: grid;
  grid-area: facts;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`

export const ProfileStat = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const ProfileActions = styled.div`
  display: flex;
  grid-area: actions;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;

  & > * {
    flex: 1 1 7rem;
    min-width: 0;
  }

  /* The xl auto column sizes to this row; reserve the two action widths and
     the back control so the placeholders do not collapse to zero. */
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    min-width: 17.75rem;
  }
`

export const ProfileBack = styled(Block)`
  && {
    flex: 0 0 2.75rem;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: ${({ theme }) => theme.radii.md};
  }
`

export const Resume = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  }
`

export const ResumeMain = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 0;
`

export const ResumeSide = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
`

export const BlockHead = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const BlockIcon = styled(Block)`
  flex: none;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const BlockHeadLine = styled.div`
  flex: 1;
  min-width: 0;
`

export const Timeline = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const TimelineRow = styled.div`
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;
`

export const TimelineMarker = styled(Block)`
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const TimelineBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const SkillsBand = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const SkillsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export const SkillGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  min-width: 0;
`

export const SkillGroupHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ProfileContactCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 38%,
      ${({ theme }) => theme.colors.border.default}
    );
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const ProfileContactActions = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
  }
`

/* ---------- Closing CTA ---------- */

export const CtaBand = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-block: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.brand.primary};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['3xl']};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    column-gap: ${({ theme }) => theme.spacing['2xl']};
  }
`

export const CtaCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  justify-items: start;
  min-width: 0;
`

export const CtaShape = styled(Block)`
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.navy} 18%,
    transparent
  );
`

export const CtaActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  & > * {
    flex: 1 1 14rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    & > * {
      flex: 0 0 auto;
    }
  }
`

export const CtaAction = styled(CtaShape)`
  width: 9rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`
