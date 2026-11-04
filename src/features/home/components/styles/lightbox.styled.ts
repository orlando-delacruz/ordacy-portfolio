import styled, { css, keyframes } from 'styled-components'

export const CLOSE_MS = 200

const backdropIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const cardIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const cardOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.98);
  }
`

export const Dialog = styled.dialog<{ $closing: boolean }>`
  width: min(92vw, 56rem);
  max-height: 90vh;
  max-height: 90dvh;
  margin: auto;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: auto;
  animation: ${cardIn} 220ms ease-out;

  &::backdrop {
    background: rgba(0, 20, 32, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: ${backdropIn} 220ms ease-out;
  }

  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${cardOut} ${CLOSE_MS}ms ease-in forwards;

      &::backdrop {
        opacity: 0;
        transition: opacity ${CLOSE_MS}ms ease-in;
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    &,
    &::backdrop {
      animation: none;
    }
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:active {
    transform: scale(0.96);
  }
`

export const Body = styled.div`
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
`
