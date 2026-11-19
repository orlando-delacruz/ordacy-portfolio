import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
  SyntheticEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { useDialogFocusTrap } from '@/hooks/useDialogFocusTrap'
import { secondaryNavItems } from './navigation'
import { BrandLogo, Wordmark } from './Wordmark'
import * as S from './styles/mobile-more-menu.styled'

type MobileMoreMenuProps = {
  onClose: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export function MobileMoreMenu({
  onClose,
  returnFocusRef,
}: MobileMoreMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const trapFocus = useDialogFocusTrap(dialogRef)

  // Drag-down-to-close: the grabber and header form the drag zone and follow
  // the pointer. Releasing past 96px (or with a fast downward flick) slides
  // the sheet off and dismisses; anything shorter snaps back. All motion is
  // state change, and reduced motion skips the animation entirely.
  const DRAG_DISMISS_PX = 96
  const DRAG_FLICK_PX_PER_MS = 0.55
  const SHEET_EXIT_MS = 220

  const sheetRef = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)
  const dragRef = useRef<{
    pointerId: number
    startY: number
    startT: number
  } | null>(null)
  const exitTimer = useRef<number | null>(null)

  useLayoutEffect(() => {
    const inner = sheetRef.current
    if (!inner) return

    const measure = () =>
      setScrollable(inner.scrollHeight > inner.clientHeight + 1)

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  useEffect(
    () => () => {
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current)
    },
    [],
  )

  const setSheetOffset = (px: number | null, animate: boolean) => {
    const sheet = sheetRef.current
    const dialog = dialogRef.current
    if (!sheet) return
    sheet.style.transition = animate
      ? `transform ${SHEET_EXIT_MS}ms ease-out`
      : 'none'
    sheet.style.transform =
      px === null ? '' : `translateY(${Math.max(px, 0)}px)`
    // The backdrop dim follows the drag so the whole sheet — card and dim —
    // travels together. Full travel (the dismiss threshold) clears the dim.
    if (dialog) {
      if (px === null) dialog.style.removeProperty('--sheet-drag')
      else
        dialog.style.setProperty(
          '--sheet-drag',
          `${Math.min(Math.max(px, 0) / DRAG_DISMISS_PX, 1)}`,
        )
    }
  }

  const dismissSheet = (fromOffset = 0) => {
    const dialog = dialogRef.current
    const sheet = sheetRef.current
    if (!dialog) return
    if (
      !sheet ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      dialog.close()
      return
    }
    const distance = sheet.getBoundingClientRect().height
    setSheetOffset(fromOffset + distance, true)
    exitTimer.current = window.setTimeout(
      () => dialog.close(),
      SHEET_EXIT_MS,
    )
  }

  const startSheetDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if ((event.target as HTMLElement).closest('button, a')) return
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startT: performance.now(),
    }
    setSheetOffset(0, false)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Synthetic or inactive pointers have nothing to capture.
    }
  }

  const moveSheetDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    setSheetOffset(event.clientY - drag.startY, false)
  }

  const endSheetDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    dragRef.current = null
    const offset = event.clientY - drag.startY
    const elapsed = Math.max(performance.now() - drag.startT, 1)
    if (
      offset >= DRAG_DISMISS_PX ||
      offset / elapsed > DRAG_FLICK_PX_PER_MS
    ) {
      dismissSheet(offset)
    } else {
      setSheetOffset(null, true)
    }
  }

  const cancelSheetDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setSheetOffset(null, true)
  }

  // Escape takes the same animated exit as a drag release.
  const cancelToDismiss = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    dismissSheet()
  }

  // Tapping the dimmed backdrop dismisses the sheet, like a native action sheet.
  const closeOnBackdrop = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) dismissSheet()
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const trigger = returnFocusRef.current

    if (!dialog.open) dialog.showModal()
    // No close button by design; land focus on the first link instead.
    dialog.querySelector<HTMLAnchorElement>('a')?.focus()
    const bodyOverflow = document.body.style.overflow
    const rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow

      requestAnimationFrame(() => {
        if (dialog.isConnected) return

        if (trigger?.offsetParent !== null) trigger?.focus()
        else document.getElementById('main-content')?.focus()
      })
    }
  }, [returnFocusRef])

  return createPortal(
    <S.Dialog
      ref={dialogRef}
      id="mobile-more-dialog"
      aria-label="More menu"
      onClose={onClose}
      onCancel={cancelToDismiss}
      onClick={closeOnBackdrop}
      onKeyDown={trapFocus}
    >
      <S.Inner
        ref={sheetRef}
        $scrollable={scrollable}
        onPointerDown={startSheetDrag}
        onPointerMove={moveSheetDrag}
        onPointerUp={endSheetDrag}
        onPointerCancel={cancelSheetDrag}
      >
        <S.Grabber aria-hidden="true" />
        <S.Header>
          <S.Brand>
            <BrandLogo />
            <Wordmark />
          </S.Brand>
        </S.Header>

        <nav aria-label="More navigation">
          <S.Section>
            <S.List>
              {secondaryNavItems.map((item) => {
                const Icon = item.icon

                return (
                  <S.Item key={item.to}>
                    <S.ItemLink to={item.to} end={item.end}>
                      <S.ItemIcon aria-hidden="true">
                        <Icon size={20} strokeWidth={2} />
                      </S.ItemIcon>
                      <S.ItemLabel>{item.label}</S.ItemLabel>
                      <S.Chevron
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </S.ItemLink>
                  </S.Item>
                )
              })}
            </S.List>
          </S.Section>
        </nav>
      </S.Inner>
    </S.Dialog>,
    document.body,
  )
}
