import styled from 'styled-components'
import { IconButton } from './admin-ui.styled'

export const Bar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const Range = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const SizeField = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  select {
    width: auto;
    min-height: 2.25rem;
    padding-block: 0;
  }
`

export const Pages = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const PageStatus = styled.span`
  min-width: 6.5rem;
  text-align: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const PageButton = styled(IconButton)``
