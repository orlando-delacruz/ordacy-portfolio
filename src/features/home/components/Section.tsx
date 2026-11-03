import styled from 'styled-components'
import type { ReactNode } from 'react'

const Wrapper = styled.section`
  padding-block: ${({ theme }) => theme.spacing['2xl']};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-block: ${({ theme }) => theme.spacing['3xl']};
  }
`

const Header = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 44rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['2xl']},
    4.5vw,
    ${({ theme }) => theme.typography.fontSizes['3xl']}
  );
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

type SectionProps = {
  id?: string
  title: string
  description?: string
  children: ReactNode
}

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <Wrapper id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <Header>
        <Title id={id ? `${id}-title` : undefined}>{title}</Title>
        {description && <Description>{description}</Description>}
      </Header>
      {children}
    </Wrapper>
  )
}
