import { Loader2 } from 'lucide-react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Wrapper = styled.span`
  display: inline-flex;
  flex: none;
`

// Rotation communicates activity; reduced motion keeps the static icon and
// relies on the visible loading text.
export const Icon = styled(Loader2)`
  flex: none;
  animation: ${spin} 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
