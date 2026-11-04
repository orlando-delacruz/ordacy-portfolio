import styled from 'styled-components'

export const Text = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.04em;
  line-height: 1;
`

export const LogoImage = styled.img`
  display: block;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  object-fit: cover;
`
