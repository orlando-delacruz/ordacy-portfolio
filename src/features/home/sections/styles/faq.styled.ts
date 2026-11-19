import styled, { keyframes } from 'styled-components'

export {
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/styles/buttons.styled'

/*
 * Motion: items rise in with a stagger the first time the list scrolls into view
 * (data-revealed, see Faq.tsx). The open item is marked by a filled icon badge,
 * a rotated toggle, and an answer that fades up.
 * Durations are choreography-specific, so they don't use theme.transitions.
 * Under prefers-reduced-motion everything renders in its final state.
 */
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

const itemRise = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Below xl reads top to bottom: questions, then contact. xl+: the questions
// run down the left and the contact actions sit in the right column.
export const Layout = styled.div`
  display: grid;
  grid-template-areas: 'list' 'aside';
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    grid-template-areas: 'list aside';
    column-gap: ${({ theme }) => theme.spacing['3xl']};
    align-items: start;
  }
`

export const Intro = styled.div`
  display: grid;
  grid-area: intro;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
`

export const List = styled.div`
  grid-area: list;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Item = styled.div<{ $index: number }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};

  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${List}[data-revealed] & {
      opacity: 1;
      animation: ${itemRise} 500ms ease-out ${({ $index }) => $index * 70}ms
        backwards;
    }

    ${List}[data-static] & {
      opacity: 1;
      animation: none;
    }
  }
`

export const ItemHeading = styled.h3`
  margin: 0;
`

export const QuestionText = styled.span`
  flex: 1;
`

export const Toggle = styled.span<{ $open: boolean }>`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid
    ${({ $open, theme }) =>
      $open ? theme.colors.text.accent : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ $open, theme }) =>
    $open ? theme.colors.text.accent : 'transparent'};
  color: ${({ $open, theme }) =>
    $open ? theme.colors.text.inverse : theme.colors.text.secondary};
  transition:
    background ${({ theme }) => theme.transitions.base},
    border-color ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};

  svg {
    transform: rotate(${({ $open }) => ($open ? '135deg' : '0deg')});
    transition: transform 400ms ${SPRING};
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      transition: none;
    }
  }
`

export const Question = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.lg} 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-align: left;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:hover ${Toggle} {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

// Animates height via grid rows (0fr → 1fr); closed content is also hidden from AT and tab order.
export const Panel = styled.div<{ $open: boolean }>`
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

export const Clip = styled.div`
  min-height: 0;
  overflow: hidden;
`

// Mobile: answer sits flush left to keep its column wide.
// md+: left padding lines it up under the question text (icon badge + gap);
// right padding keeps it clear of the toggle column.
export const Answer = styled.p<{ $open: boolean }>`
  max-width: 62ch;
  margin: 0;
  padding: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-right: calc(2rem + ${({ theme }) => theme.spacing.lg});
    padding-left: calc(${({ theme }) => theme.spacing.md} + 2.25rem);
  }

  @media (prefers-reduced-motion: no-preference) {
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transform: translateY(${({ $open }) => ($open ? '0' : '-0.375rem')});
    transition:
      opacity 300ms ease ${({ $open }) => ($open ? '120ms' : '0ms')},
      transform 300ms ease ${({ $open }) => ($open ? '120ms' : '0ms')};
  }
`

export const Aside = styled.div`
  display: grid;
  grid-area: aside;
  gap: ${({ theme }) => theme.spacing.md};
  align-content: start;
  justify-items: start;
`

export const AsideActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  /* Compact enough for both FAQ actions to share one row in the aside column. */
  & > a {
    min-height: 2.75rem;
    padding-inline: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }
`

// Category label shown above the first question of each group in the full list.
export const Category = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`
