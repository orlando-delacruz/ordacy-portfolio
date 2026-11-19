import styled from 'styled-components'

export const PageSection = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 40rem;
  padding-block: ${({ theme }) => theme.spacing['3xl']};
`

export const PageEyebrow = styled.p`
  color: ${({ theme }) => theme.colors.brand.deep};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['3xl']},
    6vw,
    ${({ theme }) => theme.typography.fontSizes['4xl']}
  );
`

export const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
