import { useAppTheme } from '@/app/theme-context'
import darkLogo from '@/assets/images/ordacy-logo-dark-mode.png'
import lightLogo from '@/assets/images/ordacy-logo.png'
import * as S from './styles/wordmark.styled'

export function Wordmark() {
  return <S.Text>ORDACY</S.Text>
}

export function BrandLogo() {
  const { theme } = useAppTheme()

  return (
    <S.LogoImage
      src={theme === 'dark' ? darkLogo : lightLogo}
      alt=""
      aria-hidden="true"
    />
  )
}
