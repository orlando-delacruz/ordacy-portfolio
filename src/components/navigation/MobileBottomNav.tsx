import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { mobileNavItems } from './navigation'
import {
  mobileItemActiveStyles,
  mobileItemStyles,
} from './navigation.styles'

const Nav = styled.nav<{ $hidden: boolean }>`
  position: fixed;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  left: 50%;
  z-index: 40;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: min(
    26rem,
    calc(
      100vw - 2rem - env(safe-area-inset-left) -
        env(safe-area-inset-right)
    )
  );
  padding: ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.sm};
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

const Item = styled(NavLink)`
  ${mobileItemStyles}

  &[aria-current='page'] {
    ${mobileItemActiveStyles}
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

const ContactItem = styled(NavLink)`
  ${mobileItemStyles}

  color: ${({ theme }) => theme.colors.brand.navy};
  opacity: 1;

  &:hover::before {
    background: ${({ theme }) => theme.colors.brand.secondary};
  }

  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3rem;
    height: 3rem;
    border-radius: ${({ theme }) => theme.radii.round};
    background: ${({ theme }) => theme.colors.brand.primary};
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
    background: ${({ theme }) => theme.colors.brand.secondary};
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`

export function MobileBottomNav() {
  const { hidden, reveal } = useScrollDirection()
  const [focusWithin, setFocusWithin] = useState(false)

  return (
    <Nav
      $hidden={hidden && !focusWithin}
      aria-label="Primary navigation"
      onFocusCapture={() => {
        setFocusWithin(true)
        reveal()
      }}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          setFocusWithin(false)
        }
      }}
    >
      {mobileNavItems.map((item) => {
        const Icon = item.icon

        if (item.to === '/contact') {
          return (
            <ContactItem
              key={item.to}
              to={item.to}
              end={item.end}
              aria-label={item.label}
            >
              <Icon size={22} strokeWidth={2} aria-hidden="true" />
            </ContactItem>
          )
        }

        return (
          <Item
            key={item.to}
            to={item.to}
            end={item.end}
            aria-label={item.label}
          >
            <Icon size={22} strokeWidth={2} aria-hidden="true" />
          </Item>
        )
      })}
    </Nav>
  )
}
