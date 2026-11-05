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
        // Form fields included so dialogs with forms keep focus inside.
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])',
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
