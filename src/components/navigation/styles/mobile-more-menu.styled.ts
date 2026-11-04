import { NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import styled, { keyframes } from 'styled-components'

const moreIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const Dialog = styled.dialog`
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  overflow-y: auto;
  overscroll-behavior: contain;

  &[open] {
    animation: ${moreIn} 180ms ease-out;
  }

  &:focus {
    outline: none;
  }
`

export const Inner = styled.div`
  width: 100%;
  max-width: 36rem;
  min-height: 100%;
  margin-inline: auto;
  padding: calc(env(safe-area-inset-top) + ${({ theme }) => theme.spacing.md})
    ${({ theme }) => theme.spacing.lg}
    calc(env(safe-area-inset-bottom) + ${({ theme }) => theme.spacing['2xl']});
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 2.75rem;
`

export const Brand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
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
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const Title = styled.h2`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
`

export const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
`

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  padding: 0;
  list-style: none;
`

export const Item = styled.li`
  min-width: 0;
`

export const ItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 3.5rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &[aria-current='page'] {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }
`

export const ItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Chevron = styled(ChevronRight)`
  flex-shrink: 0;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.7;
`
