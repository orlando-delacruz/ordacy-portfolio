import { ChevronDown, ChevronRight } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import { IconBadgeCompact } from '@/components/ui/styles/icon-badge.styled'

export { PrimaryButton } from '@/components/ui/styles/buttons.styled'

export type Tone = 'problem' | 'solution'

/*
 * Motion: the first time the section scrolls into view (data-revealed on Stage,
 * see Systems.tsx) list rows slide in one by one and the detail panel eases in.
 * Selecting an item pops its icon and spins the detail watermark in; the panel's
 * ring and dots drift slowly. Durations are choreography-specific, so they don't
 * use theme.transitions. Reduced motion shows the final, still state.
 */
const noMotionPref = '@media (prefers-reduced-motion: no-preference)'

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-0.75rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const panelIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(1rem) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`

const iconPop = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  40% {
    transform: scale(1.2) rotate(-10deg);
  }
  70% {
    transform: scale(0.95) rotate(4deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`

const watermarkIn = keyframes`
  from {
    opacity: 0;
    transform: rotate(-25deg) scale(0.8);
  }
  to {
    opacity: 0.06;
    transform: rotate(0deg) scale(1);
  }
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const bob = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`

// Wraps the mobile and desktop views; carries data-revealed for the reveal sequence.
export const Stage = styled.div``

// Mobile keeps the neutral look; desktop colors each side by meaning.
export const Badge = styled(IconBadgeCompact)<{ $tone: Tone }>`
  color: ${({ $tone, theme }) =>
    $tone === 'problem'
      ? theme.colors.text.secondary
      : theme.colors.text.accent};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    color: ${({ $tone, theme }) =>
      $tone === 'problem' && theme.mode === 'dark'
        ? theme.colors.brand.primary
        : theme.colors[$tone].accent};
  }
`

/* ---------- Desktop explorer (rendered only at lg+) ---------- */

export const ExplorerToolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ExplorerCaption = styled.p<{ $tone: Tone }>`
  grid-column: 1 / -1;
  margin: 0;
  color: ${({ $tone, theme }) =>
    $tone === 'problem' && theme.mode === 'dark'
      ? theme.colors.brand.primary
      : theme.colors[$tone].accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  text-align: center;

  &::after {
    display: block;
    width: 3rem;
    height: 0.25rem;
    margin: ${({ theme }) => theme.spacing.sm} auto 0;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: currentColor;
    content: '';
  }
`

export const Explorer = styled.div`
  display: grid;
  grid-template-columns: minmax(18rem, 5fr) minmax(0, 7fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};

  &[hidden] {
    display: none;
  }
`

// Rows share the panel height equally, so the list never ends with a dead gap.
export const ItemList = styled.div`
  display: grid;
  grid-auto-rows: minmax(3.5rem, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const ItemButton = styled.button<{
  $selected: boolean
  $tone: Tone
  $index: number
}>`
  ${noMotionPref} {
    opacity: 0;

    ${Stage}[data-revealed] & {
      opacity: 1;
      animation: ${slideIn} 450ms ease-out ${({ $index }) => 100 + $index * 70}ms
        backwards;
    }

    /* Re-runs whenever a row becomes the selected one. */
    ${Badge} svg {
      animation: ${({ $selected }) => ($selected ? iconPop : 'none')} 500ms
        ease-out;
    }
  }

  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.surface.default : 'transparent'};
  box-shadow: ${({ $selected, $tone, theme }) =>
    $selected
      ? `${theme.shadows.sm}, inset 0 0 0 1px color-mix(in srgb, ${theme.colors[$tone].accent} 40%, transparent)`
      : 'none'};

  /* Every icon gets a visible badge; the selected one is tinted with its side's tone. */
  ${Badge} {
    background: ${({ $selected, $tone, theme }) =>
      $selected
        ? `color-mix(in srgb, ${$tone === 'problem' ? theme.colors.brand.primary : theme.colors[$tone].accent} 14%, ${theme.colors.surface.default})`
        : theme.colors.surface.default};
    transition: background ${({ theme }) => theme.transitions.fast};
  }
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.text.primary : theme.colors.text.secondary};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.surface.default : theme.colors.surface.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const ItemText = styled.span`
  display: grid;
  flex: 1;
  gap: 0.125rem;
  min-width: 0;
`

export const ItemTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

// One-line preview of the description; the full text is in the detail panel.
export const ItemPreview = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemArrow = styled(ChevronRight)<{ $selected: boolean }>`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: ${({ $selected }) => ($selected ? 1 : 0)};
  transform: translateX(${({ $selected }) => ($selected ? '0' : '-0.375rem')});
  transition:
    opacity ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.base};

  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }
`

export const Detail = styled.div`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  ${noMotionPref} {
    opacity: 0;

    ${Stage}[data-revealed] & {
      opacity: 1;
      animation: ${panelIn} 600ms ease-out 250ms backwards;
    }
  }
`

// Dashed ring circling the watermark in the top-right corner; turns slowly.
export const DetailRing = styled.span<{ $tone: Tone }>`
  position: absolute;
  top: -6rem;
  right: -6rem;
  z-index: -1;
  width: 20rem;
  height: 20rem;
  border: 1px dashed
    ${({ $tone, theme }) =>
      `color-mix(in srgb, ${theme.colors[$tone].accent} 25%, transparent)`};
  border-radius: ${({ theme }) => theme.radii.round};
  pointer-events: none;

  ${noMotionPref} {
    animation: ${spin} 60s linear infinite;
  }
`

// Dot pattern fading in from the bottom-right corner.
export const DetailDots = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing.lg};
  bottom: ${({ theme }) => theme.spacing.lg};
  z-index: -1;
  width: 8rem;
  height: 5rem;
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.border.default} 1.5px,
    transparent 1.5px
  );
  background-size: 0.875rem 0.875rem;
  mask-image: linear-gradient(to top left, black, transparent 80%);
  pointer-events: none;

  ${noMotionPref} {
    animation: ${bob} 6s ease-in-out infinite;
  }
`

// Oversized faint copy of the item's icon in the corner, purely decorative depth.
export const DetailWatermark = styled.span<{ $tone: Tone }>`
  position: absolute;
  top: -3rem;
  right: -3rem;
  z-index: -1;
  color: ${({ $tone, theme }) => theme.colors[$tone].accent};
  opacity: 0.06;
  pointer-events: none;

  ${noMotionPref} {
    animation: ${watermarkIn} 700ms cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(0.25rem); }
  to { opacity: 1; transform: none; }
`

export const DetailBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  height: 100%;
  animation: ${fadeIn} ${({ theme }) => theme.transitions.base};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const DetailIcon = styled.span<{ $tone: Tone }>`
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $tone, theme }) =>
    `color-mix(in srgb, ${$tone === 'problem' ? theme.colors.brand.primary : theme.colors[$tone].accent} 14%, ${theme.colors.surface.default})`};
  box-shadow: inset 0 0 0 1px
    ${({ $tone, theme }) =>
      `color-mix(in srgb, ${theme.colors[$tone].accent} 30%, transparent)`};
  color: ${({ $tone, theme }) =>
    $tone === 'problem' && theme.mode === 'dark'
      ? theme.colors.brand.primary
      : theme.colors[$tone].accent};
`

export const DetailTitle = styled.h3`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const DetailText = styled.p`
  max-width: 60ch;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Related = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const RelatedLabel = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const RelatedList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 32rem);
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

// Linked mini-card: icon badge, title, chevron. Jumps to the related item.
export const RelatedButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  & > span:nth-child(2) {
    flex: 1;
    min-width: 0;
  }

  & > svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    background: ${({ theme }) => theme.colors.background.subtle};
  }

  &:hover > svg {
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

// Pushes the CTA to the bottom so it sits at a steady spot whatever the text length.
export const DetailAction = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
`

export const RelatedIcon = styled(IconBadgeCompact)<{ $tone: Tone }>`
  width: 2.25rem;
  height: 2.25rem;
  background: ${({ $tone, theme }) =>
    `color-mix(in srgb, ${$tone === 'problem' ? theme.colors.brand.primary : theme.colors[$tone].accent} 14%, ${theme.colors.surface.default})`};
  color: ${({ $tone, theme }) =>
    $tone === 'problem' && theme.mode === 'dark'
      ? theme.colors.brand.primary
      : theme.colors[$tone].accent};
`

/* ---------- Mobile tabs + accordion ---------- */

export const ColumnDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    text-align: left;
  }
`

// Mobile only: the section header already adds spacing above the tab bar.
export const TabDescription = styled(ColumnDescription)`
  margin: ${({ theme }) => theme.spacing.md} 0;
`

export const TabList = styled.div<{ $inline?: boolean }>`
  display: ${({ $inline }) => ($inline ? 'inline-grid' : 'grid')};
  min-width: ${({ $inline }) => ($inline ? '20rem' : '0')};
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const Tab = styled.button<{ $active: boolean; $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.75rem;
  padding-inline: ${({ theme }) => theme.spacing.lg};

  svg {
    color: ${({ $active, $tone, theme }) =>
      $active ? theme.colors[$tone].accent : 'currentColor'};

    /* Desktop: icons stay in the theme family (no gray); activity reads via opacity. */
    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      color: ${({ $tone, theme }) =>
        $tone === 'problem' && theme.mode === 'dark'
          ? theme.colors.brand.primary
          : theme.colors[$tone].accent};
      opacity: ${({ $active }) => ($active ? 1 : 0.55)};
    }
  }

  /* The newly active tab's icon pops. */
  ${noMotionPref} {
    svg {
      animation: ${({ $active }) => ($active ? iconPop : 'none')} 500ms ease-out;
    }
  }

  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.surface.default : 'transparent'};
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadows.sm : 'none')};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text.primary : theme.colors.text.secondary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

// One grouped surface with hairline dividers instead of a stack of separate boxes.
export const AccordionList = styled.ul`
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  list-style: none;
`

export const AccordionItem = styled.li<{ $index: number }>`
  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  }

  ${noMotionPref} {
    opacity: 0;

    ${Stage}[data-revealed] & {
      opacity: 1;
      animation: ${rise} 450ms ease-out ${({ $index }) => 100 + $index * 70}ms
        backwards;
    }
  }
`

export const AccordionHeading = styled.h4`
  margin: 0;
`

export const AccordionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  min-height: 4rem;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  text-align: left;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: -2px;
  }
`

export const AccordionTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

// Round trailing control; fills with the accent color when its row is open.
export const ChevronWrap = styled.span<{ $open: boolean; $tone: Tone }>`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ $open, theme }) =>
    $open ? theme.colors.text.accent : theme.colors.background.subtle};
  color: ${({ $open, theme }) =>
    $open ? theme.colors.text.inverse : theme.colors.text.secondary};
  transition:
    background ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    background: ${({ $open, $tone, theme }) =>
      $open ? theme.colors[$tone].accent : theme.colors.background.subtle};
  }
`

export const Chevron = styled(ChevronDown)<{ $open: boolean }>`
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  transition: transform ${({ theme }) => theme.transitions.base};
`

// Animates height via grid rows (0fr → 1fr); closed content is also hidden from AT and tab order.
export const AccordionPanel = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition:
    grid-template-rows ${({ theme }) => theme.transitions.slow},
    visibility ${({ theme }) => theme.transitions.slow};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const AccordionClip = styled.div`
  min-height: 0;
  overflow: hidden;
`

// Left padding lines the text up under the title (row padding + icon badge + gap).
export const AccordionText = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg}
    calc(${({ theme }) => theme.spacing.lg} + 2.5rem + ${({ theme }) => theme.spacing.md});
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
