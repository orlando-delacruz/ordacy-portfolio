import { Link } from 'react-router-dom'
import styled from 'styled-components'

export {
  PageDescription as Description,
  PageEyebrow as Code,
  PageSection as Section,
  PageTitle as Title,
} from '@/components/common/styles/page.styled'

export const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-self: start;
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.brand.deep};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`
