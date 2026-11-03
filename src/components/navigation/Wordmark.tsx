import styled from 'styled-components'
import { useAppTheme } from '@/app/theme-context'
import darkLogo from '@/assets/images/ordacy-logo-dark-mode.png'
import lightLogo from '@/assets/images/ordacy-logo.png'

const Text = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.04em;
  line-height: 1;
`

const LogoImage = styled.img`
  display: block;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  object-fit: cover;
`

export function Wordmark() {
  return <Text>ORDACY</Text>
}

export function BrandLogo() {
  const { theme } = useAppTheme()

  return (
    <LogoImage
      src={theme === 'dark' ? darkLogo : lightLogo}
      alt=""
      aria-hidden="true"
    />
  )
}
