import { VisuallyHidden } from './VisuallyHidden'
import * as S from './styles/spinner.styled'

export type SpinnerSize = 14 | 16 | 18 | 20 | 24

type SpinnerProps = {
  size?: SpinnerSize
  /** Accessible loading text. Without it the spinner is decorative. */
  label?: string
}

/**
 * The only rotating indicator in the public site: real async work only.
 * Callers that already show visible loading text leave `label` off so the
 * spinner stays hidden from assistive tech.
 */
export function Spinner({ size = 16, label }: SpinnerProps) {
  return (
    <S.Wrapper
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      <S.Icon size={size} strokeWidth={2} aria-hidden="true" focusable="false" />
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </S.Wrapper>
  )
}
