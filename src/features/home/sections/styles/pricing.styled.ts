import styled from 'styled-components'

export {
  PrimaryButton,
  SecondaryButton,
} from '../../components/styles/buttons.styled'

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`

export const ToolbarLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`

export const Toggle = styled.div`
  display: inline-flex;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const ToggleOption = styled.button<{ $selected: boolean }>`
  min-height: 2.5rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.lg};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.surface.default : 'transparent'};
  box-shadow: ${({ $selected, theme }) =>
    $selected ? theme.shadows.sm : 'none'};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.text.primary : theme.colors.text.secondary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

// Below lg: a swipeable row with snap points; the next card peeks in to hint at scrolling.
export const Grid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  /* Top padding leaves room for the featured card's badge, which overhangs its top edge. */
  padding-block: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.lg};
  }

  & > * {
    flex: 0 0 min(85%, 22rem);
    scroll-snap-align: start;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    padding-block: 0;
    overflow: visible;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.lg};
    row-gap: 0;
  }
`

// Desktop: each card spans 5 shared rows (subgrid) so prices, lists and buttons line up across plans.
export const Card = styled.article<{ $featured: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    ${({ $featured, theme }) =>
      $featured ? theme.colors.text.accent : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  /* Featured: the inset ring doubles the accent border to 2px without shifting layout. */
  box-shadow: ${({ $featured, theme }) =>
    $featured
      ? `inset 0 0 0 1px ${theme.colors.text.accent}, ${theme.shadows.md}`
      : 'none'};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-row: span 5;
    grid-template-rows: subgrid;
    row-gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    transform: ${({ $featured, theme }) =>
      $featured ? `translateY(-${theme.spacing.sm})` : 'none'};
  }
`

// Bright brand-teal pill on the featured card's top edge (brand tokens match in both themes).
export const FeaturedBadge = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.brand.primary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  color: ${({ theme }) => theme.colors.brand.navy};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  white-space: nowrap;
  transform: translate(-50%, -50%);
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

export const PlanIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const NameRow = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const PlanName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
`

export const Category = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface.subtle};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`

// Featured plan: price sits on a light teal-tinted panel.
export const PriceBlock = styled.div<{ $featured: boolean }>`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ $featured, theme }) =>
    $featured &&
    `
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.radii.md};
    background: ${theme.colors.background.subtle};
  `}
`

export const PriceLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`

export const Price = styled.p<{ $featured: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.125em;
  margin: 0;
  color: ${({ $featured, theme }) =>
    $featured ? theme.colors.text.accent : theme.colors.text.primary};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['2xl']},
    3vw,
    ${({ theme }) => theme.typography.fontSizes['3xl']}
  );
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

// Smaller, raised currency symbol (featured plan only).
export const Currency = styled.span`
  margin-top: 0.2em;
  font-size: 0.55em;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const PriceNote = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const Positioning = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const FitList = styled.ul`
  display: grid;
  flex: 1;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: ${({ theme }) => theme.spacing.lg} 0 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  list-style: none;
`

export const FitItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

export const FitIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.text.accent};
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const CardAction = styled.div`
  display: grid;
  align-content: end;

  & > a {
    width: 100%;
  }
`

// One grouped panel: rows split by hairlines on mobile, three columns with dividers on desktop.
export const Notes = styled.ul`
  display: grid;
  margin: ${({ theme }) => theme.spacing.xl} 0 0;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.subtle};
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: ${({ theme }) => theme.spacing['2xl']};
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`

export const Note = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.lg};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};

    & + & {
      border-top: 0;
      border-inline-start: 1px solid ${({ theme }) => theme.colors.border.default};
    }
  }
`

export const NoteIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const NoteTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const NoteText = styled.p`
  max-width: 32ch;
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Help = styled.div`
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

export const HelpTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const HelpText = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`
