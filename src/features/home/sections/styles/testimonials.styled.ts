import styled from 'styled-components'
import { EmptyState as BaseEmptyState } from '../../components/styles/empty-state.styled'

export { EmptyText, EmptyTitle } from '../../components/styles/empty-state.styled'
export { SecondaryButton } from '../../components/styles/buttons.styled'

export const EmptyState = styled(BaseEmptyState)`
  color: ${({ theme }) => theme.colors.text.accent};
`

export const Actions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`
