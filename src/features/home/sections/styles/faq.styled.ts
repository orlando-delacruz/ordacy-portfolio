import { ChevronDown } from 'lucide-react'
import styled from 'styled-components'

export const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 48rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Item = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const ItemHeading = styled.h3`
  margin: 0;
`

export const Question = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  min-height: 3.5rem;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border: 0;
  background: transparent;
  color: ${({ $open, theme }) =>
    $open ? theme.colors.text.accent : theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-align: left;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const Chevron = styled(ChevronDown)<{ $open: boolean }>`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  transition: transform ${({ theme }) => theme.transitions.fast};
`

export const Answer = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
