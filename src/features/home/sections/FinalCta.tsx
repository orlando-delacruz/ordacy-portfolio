import styled from 'styled-components'
import { PrimaryButton, SecondaryButton } from '../components/Buttons'

const Banner = styled.section`
  margin-block: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.subtle};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['3xl']};
  }
`

const Title = styled.h2`
  max-width: 36rem;
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
  max-width: 40rem;
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

export function FinalCta() {
  return (
    <Banner aria-labelledby="final-cta-title">
      <Title id="final-cta-title">
        Let&apos;s Build Something That Works Better for Your Business.
      </Title>
      <Description>
        Tell us about your business, the challenges you&apos;re facing, and what
        you&apos;d like to improve. We&apos;ll help you explore the right
        digital solution.
      </Description>
      <Actions>
        <PrimaryButton to="/contact">Start a Project</PrimaryButton>
        <SecondaryButton to="/#services">
          Explore Our Services
        </SecondaryButton>
      </Actions>
    </Banner>
  )
}
