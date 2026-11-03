import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 40rem;
  padding-block: ${({ theme }) => theme.spacing['3xl']};
`

const Code = styled.p`
  color: ${({ theme }) => theme.colors.brand.deep};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Title = styled.h1`
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['3xl']},
    6vw,
    ${({ theme }) => theme.typography.fontSizes['4xl']}
  );
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

const HomeLink = styled(Link)`
  justify-self: start;
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.brand.deep};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export function NotFoundPage() {
  return (
    <Section>
      <Code>404</Code>
      <Title>Page not found</Title>
      <Description>
        The page you are looking for does not exist or has moved.
      </Description>
      <HomeLink to="/">Back to home</HomeLink>
    </Section>
  )
}
