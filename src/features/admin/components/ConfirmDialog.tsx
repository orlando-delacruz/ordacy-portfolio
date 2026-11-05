import { Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'
import * as S from './styles/admin-ui.styled'

type ConfirmDialogProps = {
  title: string
  message: string
  confirmLabel?: string
  /** Resolve true to close; false keeps the dialog open (e.g. on error). */
  onConfirm: () => Promise<boolean>
  onClose: () => void
  returnFocusTo: HTMLButtonElement | null
}

/** Destructive-action confirmation built on the shared native dialog. */
export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete permanently',
  onConfirm,
  onClose,
  returnFocusTo,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)

  const confirm = async () => {
    setBusy(true)
    const done = await onConfirm()
    setBusy(false)
    if (done) onClose()
  }

  return (
    <Lightbox
      title={title}
      closeLabel="Cancel"
      onClose={onClose}
      returnFocusTo={returnFocusTo}
      size="sm"
    >
      <S.DialogBody>
        <S.PanelText>{message}</S.PanelText>
        <S.DialogActions>
          <S.SecondaryAction type="button" onClick={onClose} disabled={busy}>
            <X size={16} strokeWidth={2} aria-hidden="true" />
            Cancel
          </S.SecondaryAction>
          <S.DangerAction type="button" onClick={confirm} disabled={busy}>
            <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
            {busy ? 'Deleting…' : confirmLabel}
          </S.DangerAction>
        </S.DialogActions>
      </S.DialogBody>
    </Lightbox>
  )
}
