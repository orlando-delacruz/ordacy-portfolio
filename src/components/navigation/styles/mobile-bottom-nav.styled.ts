import { NavLink } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import * as nav from './navigation.styled'

export const Nav = styled.nav<{ $hidden: boolean }>`
  position: fixed;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  left: 50%;
  z-index: 40;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: min(
    28rem,
    calc(
      100vw - 2rem - env(safe-area-inset-left) -
        env(safe-area-inset-right)
    )
  );
  padding: ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ theme }) => theme.shadows.md};
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  transform: translate(-50%, ${({ $hidden }) => ($hidden ? '150%' : '0')});
  transition:
    transform ${({ theme }) => theme.transitions.slow},
    opacity ${({ theme }) => theme.transitions.base};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

// Icon sits in a small pill that fills in for the active page (and tints on hover).
export const IconPill = styled.span`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: transparent;
  transition: background ${({ theme }) => theme.transitions.fast};
`

export const Label = styled.span`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Item = styled(NavLink)`
  ${nav.mobileItemStyles}

  &:hover ${IconPill} {
    background: ${({ theme }) => theme.colors.surface.subtle};
  }

  &[aria-current='page'] {
    ${nav.mobileItemActiveStyles}
  }

  &[aria-current='page'] ${IconPill} {
    background: ${({ theme }) => theme.colors.background.subtle};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  }
`

const contactEcho = keyframes`
  0% {
    opacity: 0.55;
    transform: translate(-50%, -50%) scale(1);
  }
  70% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.45);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.45);
  }
`

export const ContactItem = styled(NavLink)`
  ${nav.mobileItemStyles}

  color: ${({ theme }) => (theme.mode === 'dark' ? '#ffffff' : '#000000')};
  opacity: 1;

  &:hover::before {
    background: ${({ theme }) =>
      theme.mode === 'dark'
        ? '#007A85'
        : theme.colors.brand.secondary};
  }

  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3rem;
    height: 3rem;
    border-radius: ${({ theme }) => theme.radii.round};
    /* Dark-teal circle in dark mode; dark.brand.deep is redefined per
       theme, so the dark-teal background uses an explicit hex. */
    background: ${({ theme }) =>
      theme.mode === 'dark' ? '#00585E' : theme.colors.brand.primary};
    content: '';
    transform: translate(-50%, -50%);
    transition: background ${({ theme }) => theme.transitions.fast};
  }

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3rem;
    height: 3rem;
    border: 2px solid ${({ theme }) => theme.colors.brand.primary};
    border-radius: ${({ theme }) => theme.radii.round};
    content: '';
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: ${contactEcho} 2.4s ease-out infinite;
  }

  & > svg {
    position: relative;
  }

  &[aria-current='page']::before {
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.colors.surface.default},
      0 0 0 4px ${({ theme }) => theme.colors.text.accent};
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`
