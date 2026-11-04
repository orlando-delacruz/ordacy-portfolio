import type { KeyboardEvent, RefObject } from 'react'

export function useDialogFocusTrap(
  dialogRef: RefObject<HTMLDialogElement | null>,
) {
  return (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return

    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = [
      ...dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      ),
    ].filter((element) => element.offsetParent !== null)

    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}
