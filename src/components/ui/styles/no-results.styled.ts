import styled from 'styled-components'

export const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  text-align: center;
`

export const Icon = styled.span`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const Title = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
`

export const Description = styled.p`
  max-width: 46ch;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Actions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`
