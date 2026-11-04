import styled, { keyframes } from 'styled-components'

/*
 * Reveal sequence (runs once when the timeline scrolls into view, see Process.tsx):
 * each step's node pops in and pulses, its text rises in, then its rail segment
 * fills toward the next node. Steps are staggered by `--step` (set from $index).
 * Durations are choreography-specific, so they don't use theme.transitions.
 * Under prefers-reduced-motion everything renders in its final state.
 */
const STEP_DELAY = '450ms'
const stepDelay = (offset = '0ms') => `calc(var(--step) * ${STEP_DELAY} + ${offset})`

const nodePop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  60% {
    opacity: 1;
    transform: scale(1.08);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

const nodePulse = keyframes`
  0% {
    opacity: 0.55;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.9);
  }
`

const textRise = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Below xl: a vertical rail down the left. xl+: a horizontal track across four columns.
export const Timeline = styled.ol`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.lg};
  }
`

export const Marker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  /* The rail segment joining this step's node to the next one. An accent layer
     sits on top of the base line and grows to fill it once revealed. */
  &::after {
    flex: 1;
    width: 2px;
    min-height: ${({ theme }) => theme.spacing.md};
    margin-block: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.pill};
    background:
      linear-gradient(
          ${({ theme }) => theme.colors.text.accent},
          ${({ theme }) => theme.colors.text.accent}
        )
        top / 100% 100% no-repeat,
      ${({ theme }) => theme.colors.border.default};
    content: '';
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    flex-direction: row;

    &::after {
      width: auto;
      height: 2px;
      min-height: 0;
      margin-block: 0;
      background-position: left;
      /* Runs through the column gap, stopping just short of the next node. */
      margin-inline: ${({ theme }) =>
        `${theme.spacing.sm} calc(${theme.spacing.sm} - ${theme.spacing.lg})`};
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    &::after {
      background-size: 100% 0%, auto;
      transition: background-size 500ms ease-in-out ${stepDelay('300ms')};
    }

    ${Timeline}[data-revealed] &::after {
      background-size: 100% 100%, auto;
    }
  }

  @media (prefers-reduced-motion: no-preference) and (min-width: ${({ theme }) =>
      theme.breakpoints.xl}) {
    ${Timeline}:not([data-revealed]) &::after {
      background-size: 0% 100%, auto;
    }
  }
`

export const Step = styled.li<{ $index: number }>`
  --step: ${({ $index }) => $index};

  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  column-gap: ${({ theme }) => theme.spacing.md};

  &:last-child ${Marker}::after {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: ${({ theme }) => theme.spacing.lg};
    align-content: start;
  }
`

export const Node = styled.span`
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.text.accent};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
  transition: transform ${({ theme }) => theme.transitions.base};

  /* Ring that ripples out once as the node activates. */
  &::before {
    position: absolute;
    inset: -1px;
    border: 1px solid ${({ theme }) => theme.colors.text.accent};
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
    content: '';
  }

  ${Step}:hover & {
    transform: scale(1.06);
  }

  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    /* backwards fill (not both) so the hover scale still works afterwards. */
    ${Timeline}[data-revealed] & {
      opacity: 1;
      animation: ${nodePop} 450ms cubic-bezier(0.34, 1.56, 0.64, 1) ${stepDelay()}
        backwards;
    }

    ${Timeline}[data-revealed] &::before {
      animation: ${nodePulse} 900ms ease-out ${stepDelay('250ms')} 2;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    ${Step}:hover & {
      transform: none;
    }
  }
`

export const StepBody = styled.div`
  /* Centers the title line on the node, and spaces steps along the rail. */
  padding-top: ${({ theme }) => theme.spacing.xs};
  padding-bottom: ${({ theme }) => theme.spacing.xl};

  ${Step}:last-child & {
    padding-bottom: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 ${({ theme }) => theme.spacing.md} 0 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${Timeline}[data-revealed] & {
      animation: ${textRise} 500ms ease-out ${stepDelay('120ms')} both;
    }
  }
`

export const StepLabel = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const StepTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const StepText = styled.p`
  max-width: 34ch;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
