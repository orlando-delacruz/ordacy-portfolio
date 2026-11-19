import styled, { keyframes } from 'styled-components'

/*
 * Reveal sequence (runs once when the journey scrolls into view, see
 * Journey.tsx): each node pops in, its title rises, then its rail segment
 * fills toward the next node. Steps are staggered by `--step` (set from
 * $index). Durations are choreography-specific, so they don't use
 * theme.transitions. Under prefers-reduced-motion everything renders final.
 */
const STEP_DELAY = '140ms'
const stepDelay = (offset = '0ms') =>
  `calc(var(--step) * ${STEP_DELAY} + ${offset})`

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

const titleRise = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const List = styled.ol`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.lg};
    align-items: start;
  }
`

export const Item = styled.li<{ $index: number }>`
  --step: ${({ $index }) => $index};

  position: relative;
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  column-gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;

  /* Vertical rail joining this node to the next one. An accent layer sits on
     top of the base line and grows to fill it once revealed. */
  &:not(:last-child)::before {
    position: absolute;
    top: 3rem;
    bottom: 0;
    left: 1.5rem;
    width: 2px;
    border-radius: ${({ theme }) => theme.radii.pill};
    transform: translateX(-50%);
    background:
      linear-gradient(
          ${({ theme }) => theme.colors.text.accent},
          ${({ theme }) => theme.colors.text.accent}
        )
        top / 100% 100% no-repeat,
      ${({ theme }) => theme.colors.border.default};
    content: '';
  }

  @media (prefers-reduced-motion: no-preference) {
    &:not(:last-child)::before {
      background-size: 100% 0%, auto;
      transition: background-size 420ms ease-in-out ${stepDelay('180ms')};
    }

    ${List}[data-revealed] &:not(:last-child)::before {
      background-size: 100% 100%, auto;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;

    &:not(:last-child)::before {
      display: none;
    }

    /* Horizontal connector running through the column gap to the next node. */
    &:not(:last-child)::after {
      position: absolute;
      top: 1.5rem;
      right: calc(-1 * ${({ theme }) => theme.spacing.lg});
      left: 3rem;
      z-index: 0;
      height: 2px;
      border-radius: ${({ theme }) => theme.radii.pill};
      transform: translateY(-50%);
      background:
        linear-gradient(
            ${({ theme }) => theme.colors.text.accent},
            ${({ theme }) => theme.colors.text.accent}
          )
          left / 100% 100% no-repeat,
        ${({ theme }) => theme.colors.border.default};
      content: '';
    }
  }

  @media (prefers-reduced-motion: no-preference) and (min-width: ${({ theme }) =>
      theme.breakpoints.lg}) {
    &:not(:last-child)::after {
      background-size: 0% 100%, auto;
      transition: background-size 420ms ease-in-out ${stepDelay('180ms')};
    }

    ${List}[data-revealed] &:not(:last-child)::after {
      background-size: 100% 100%, auto;
    }
  }
`

export const Node = styled.span`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 1px solid ${({ theme }) => theme.colors.text.accent};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.accent};

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

  ${Item}:last-child & {
    border-color: transparent;
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.brand.navy};
  }

  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${List}[data-revealed] & {
      opacity: 1;
      animation: ${nodePop} 420ms cubic-bezier(0.34, 1.56, 0.64, 1)
        ${stepDelay()} backwards;
    }

    ${List}[data-revealed] &::before {
      animation: ${nodePulse} 800ms ease-out ${stepDelay('220ms')} 2;
    }
  }
`

export const Body = styled.div`
  min-width: 0;
  padding-top: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.lg};

  ${Item}:last-child & {
    padding-bottom: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;

    ${List}[data-revealed] & {
      animation: ${titleRise} 400ms ease-out ${stepDelay('100ms')} both;
    }
  }
`

export const Title = styled.h3`
  margin: 0;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: ${({ theme }) => theme.spacing.md} 0 0;
  }
`
