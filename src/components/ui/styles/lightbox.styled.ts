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

export const Dialog = styled.dialog<{ $closing: boolean; $size: 'md' | 'sm' }>`
  width: min(92vw, ${({ $size }) => ($size === 'sm' ? '30rem' : '56rem')});
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

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const zoomOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
`

// Image-only viewer: a transparent full-screen dialog over a blurred backdrop.
// Clicking anywhere outside the image closes it (see Lightbox.tsx).
export const BareDialog = styled.dialog<{ $closing: boolean }>`
  width: 100vw;
  max-width: none;
  height: 100vh;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  border: 0;
  background: transparent;
  overflow: hidden;

  &[open] {
    display: grid;
  }

  &::backdrop {
    background: rgba(0, 20, 32, 0.6);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    animation: ${backdropIn} 220ms ease-out;
  }

  ${({ $closing }) =>
    $closing &&
    css`
      &::backdrop {
        opacity: 0;
        transition: opacity ${CLOSE_MS}ms ease-in;
      }
    `}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['3xl']};
  }

  @media (prefers-reduced-motion: reduce) {
    &::backdrop {
      animation: none;
    }
  }
`

export const BareBody = styled.div`
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: 0;
  animation: ${zoomIn} 260ms cubic-bezier(0.2, 0.9, 0.3, 1.1);

  ${BareDialog}[data-closing] & {
    animation: ${zoomOut} ${CLOSE_MS}ms ease-in forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
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

export const CloseButton = styled.button<{ $bare?: boolean }>`
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

  /* Bare viewer: floats in the viewport corner, light-on-dark over the blur. */
  ${({ $bare, theme }) =>
    $bare &&
    css`
      position: fixed;
      top: ${theme.spacing.md};
      right: ${theme.spacing.md};
      z-index: 1;
      border-color: rgba(254, 254, 254, 0.3);
      background: rgba(254, 254, 254, 0.14);
      color: ${theme.colors.brand.white};

      &:hover {
        background: rgba(254, 254, 254, 0.26);
        color: ${theme.colors.brand.white};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.brand.white};
        outline-offset: 2px;
      }
    `}
`

export const Body = styled.div`
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
`
