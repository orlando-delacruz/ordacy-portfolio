import styled from 'styled-components'

const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 40rem;
  padding-block: ${({ theme }) => theme.spacing['3xl']};
`

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.colors.brand.deep};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
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

type PagePlaceholderProps = {
  title: string
  description: string
}

export function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <Section>
      <Eyebrow>Foundation</Eyebrow>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Section>
  )
}
