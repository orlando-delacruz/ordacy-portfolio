import { Moon, Sun } from 'lucide-react'
import type { ThemeName } from '@/styles/theme'
import * as S from './styles/theme-transition.styled'

const SUN_COLOR = '#E8A33D'
const MOON_COLOR = '#5FE7D4'

export function ThemeTransitionOverlay({ to }: { to: ThemeName }) {
  const Outgoing = to === 'dark' ? Sun : Moon
  const Incoming = to === 'dark' ? Moon : Sun

  return (
    <S.Overlay $to={to} aria-hidden="true">
      <S.IconStack>
        <S.OutgoingIcon>
          <Outgoing
            size={64}
            strokeWidth={1.75}
            color={to === 'dark' ? SUN_COLOR : MOON_COLOR}
            aria-hidden="true"
          />
        </S.OutgoingIcon>
        <S.IncomingIcon>
          <Incoming
            size={64}
            strokeWidth={1.75}
            color={to === 'dark' ? MOON_COLOR : SUN_COLOR}
            aria-hidden="true"
          />
        </S.IncomingIcon>
      </S.IconStack>
    </S.Overlay>
  )
}
