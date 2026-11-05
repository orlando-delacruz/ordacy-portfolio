import { CircleAlert, Save, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'
import * as F from './styles/form.styled'
import * as U from './styles/admin-ui.styled'

export type FieldErrors = Record<string, string>

type FormDialogProps = {
  title: string
  submitLabel?: string
  /** Returns field errors keyed by input name; empty means valid. */
  validate: (data: FormData) => FieldErrors
  /** Resolve true to close the dialog. */
  onSave: (data: FormData) => Promise<boolean>
  onClose: () => void
  returnFocusTo: HTMLButtonElement | null
  children: (errors: FieldErrors) => ReactNode
}

/** Create/edit dialog: native dialog + uncontrolled form + validation. */
export function FormDialog({
  title,
  submitLabel = 'Save changes',
  validate,
  onSave,
  onClose,
  returnFocusTo,
  children,
}: FormDialogProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    const data = new FormData(form)
    const found = validate(data)
    setErrors(found)

    const first = Object.keys(found)[0]
    if (first) {
      const element = form.elements.namedItem(first)
      if (element instanceof HTMLElement) element.focus()
      return
    }

    setBusy(true)
    const saved = await onSave(data)
    setBusy(false)
    if (saved) onClose()
  }

  const errorCount = Object.keys(errors).length

  return (
    <Lightbox
      title={title}
      closeLabel="Close without saving"
      onClose={onClose}
      returnFocusTo={returnFocusTo}
    >
      <U.DialogBody>
        <F.Form onSubmit={submit} noValidate>
          {errorCount > 0 && (
            <F.ErrorText role="alert">
              <CircleAlert size={14} strokeWidth={2.25} aria-hidden="true" />
              Fix {errorCount === 1 ? 'the highlighted field' : `${errorCount} highlighted fields`} to save.
            </F.ErrorText>
          )}
          {children(errors)}
          <F.Actions>
            <U.SecondaryAction type="button" onClick={onClose} disabled={busy}>
              <X size={16} strokeWidth={2} aria-hidden="true" />
              Cancel
            </U.SecondaryAction>
            <U.PrimaryAction type="submit" disabled={busy}>
              <Save size={16} strokeWidth={2} aria-hidden="true" />
              {busy ? 'Saving…' : submitLabel}
            </U.PrimaryAction>
          </F.Actions>
        </F.Form>
      </U.DialogBody>
    </Lightbox>
  )
}
