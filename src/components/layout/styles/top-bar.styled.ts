import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  min-height: 3.5rem;
  margin-inline: auto;
  padding: env(safe-area-inset-top) ${({ theme }) => theme.spacing.lg} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 4rem;
  }
`

export const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  text-decoration: none;

  &:hover {
    color: inherit;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

export const Title = styled.p`
  display: none;
  min-width: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;
  }
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
`

export const ThemeToggle = styled.button`
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

export const MoreButton = styled(ThemeToggle)`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

export const SidebarToggle = styled(ThemeToggle)`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
  }
`
