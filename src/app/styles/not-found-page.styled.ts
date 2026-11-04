import { Link } from 'react-router-dom'
import styled from 'styled-components'

export {
  PageDescription as Description,
  PageEyebrow as Code,
  PageSection as Section,
  PageTitle as Title,
} from '@/components/common/styles/page.styled'

export const HomeLink = styled(Link)`
  justify-self: start;
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.brand.deep};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`
