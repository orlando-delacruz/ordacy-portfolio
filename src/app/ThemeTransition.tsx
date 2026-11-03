import styled, { keyframes } from 'styled-components'
import { Moon, Sun } from 'lucide-react'
import { darkTheme, lightTheme } from '@/styles/theme'
import type { ThemeName } from '@/styles/theme'

const OVERLAY_MS = 950

const overlayInOut = keyframes`
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  78% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const iconOut = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }
  16% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  42% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  64% {
    opacity: 0;
    transform: rotate(90deg) scale(1.25);
  }
  100% {
    opacity: 0;
    transform: rotate(90deg) scale(1.25);
  }
`

const iconIn = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }
  32% {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }
  58% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
`

const Overlay = styled.div<{ $to: ThemeName }>`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  background: ${({ $to }) =>
    $to === 'dark'
      ? darkTheme.colors.background.default
      : lightTheme.colors.background.default};
  animation: ${overlayInOut} ${OVERLAY_MS}ms ease forwards;
  pointer-events: auto;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0;
  }
`

const IconStack = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
`

const iconStyles = `
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation-duration: ${OVERLAY_MS}ms;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
`

const OutgoingIcon = styled.div`
  ${iconStyles}
  animation-name: ${iconOut};
`

const IncomingIcon = styled.div`
  ${iconStyles}
  animation-name: ${iconIn};
  filter: drop-shadow(0 0 1.5rem rgba(0, 218, 185, 0.45));
`

const SUN_COLOR = '#E8A33D'
const MOON_COLOR = '#5FE7D4'

export function ThemeTransitionOverlay({ to }: { to: ThemeName }) {
  const Outgoing = to === 'dark' ? Sun : Moon
  const Incoming = to === 'dark' ? Moon : Sun

  return (
    <Overlay $to={to} aria-hidden="true">
      <IconStack>
        <OutgoingIcon>
          <Outgoing
            size={64}
            strokeWidth={1.75}
            color={to === 'dark' ? SUN_COLOR : MOON_COLOR}
            aria-hidden="true"
          />
        </OutgoingIcon>
        <IncomingIcon>
          <Incoming
            size={64}
            strokeWidth={1.75}
            color={to === 'dark' ? MOON_COLOR : SUN_COLOR}
            aria-hidden="true"
          />
        </IncomingIcon>
      </IconStack>
    </Overlay>
  )
}
