import styled from 'styled-components'

export {
  PageDescription as Description,
  PageEyebrow as Code,
  PageSection as Section,
  PageTitle as Title,
} from '@/components/common/styles/page.styled'
export {
  PrimaryButton as PrimaryLink,
  SecondaryButton as SecondaryLink,
} from '@/components/ui/styles/buttons.styled'

export const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`
