import styled, { keyframes } from 'styled-components'

const enter = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const Region = styled.div`
  position: fixed;
  right: ${({ theme }) => theme.spacing.md};
  bottom: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  z-index: 200;
  display: grid;
  justify-items: end;
  gap: ${({ theme }) => theme.spacing.sm};
  pointer-events: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    left: auto;
    width: 24rem;
  }
`

export const Toast = styled.div<{ $tone: 'success' | 'error' }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-left: 3px solid
    ${({ $tone, theme }) =>
      $tone === 'success' ? theme.colors.status.success : theme.colors.danger.text};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ theme }) => theme.shadows.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  pointer-events: auto;

  & > svg {
    flex: none;
    margin-top: 0.1rem;
    color: ${({ $tone, theme }) =>
      $tone === 'success' ? theme.colors.status.success : theme.colors.danger.text};
  }

  span {
    flex: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: ${enter} 200ms ease-out;
  }
`

export const Dismiss = styled.button`
  display: grid;
  flex: none;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
  }
`
