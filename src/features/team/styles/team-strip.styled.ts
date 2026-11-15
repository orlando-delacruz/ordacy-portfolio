import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Strip = styled.div`
  display: grid;
  justify-items: start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-inline: ${({ theme }) => theme.spacing.xl};
  }
`

export const StripText = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const StripLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const StripWords = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const AvatarCluster = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const AvatarItem = styled.li``

export const AvatarLink = styled(Link)`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.surface.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  letter-spacing: 0.02em;
  text-decoration: none;
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    text-decoration: none;
    transform: translateY(-2px);
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

export const AvatarImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`
