import { CircleAlert } from 'lucide-react'
import { useState } from 'react'
import * as F from './styles/form.styled'

type TextFieldProps = {
  name: string
  label: string
  /** Prefixes the input id so the same name can appear in several forms. */
  idPrefix?: string
  defaultValue?: string | null
  error?: string
  hint?: string
  optional?: boolean
  multiline?: boolean
  rows?: number
  type?: 'text' | 'url' | 'email'
  /** Shows a live character count against this soft limit. */
  softLimit?: number
  wide?: boolean
  disabled?: boolean
  placeholder?: string
  /** id of a <datalist> with suggestions. */
  list?: string
  /** Small badge next to the label, e.g. "Not set". */
  badge?: string
}

/** Labelled input/textarea with hint, error, and optional character count. */
export function TextField({
  name,
  label,
  idPrefix = 'field',
  defaultValue,
  error,
  hint,
  optional,
  multiline,
  rows = 4,
  type = 'text',
  softLimit,
  wide,
  disabled,
  placeholder,
  badge,
  list,
}: TextFieldProps) {
  const id = `${idPrefix}-${name}`
  const [length, setLength] = useState((defaultValue ?? '').length)
  const describedBy =
    [hint || softLimit ? `${id}-hint` : '', error ? `${id}-error` : '']
      .filter(Boolean)
      .join(' ') || undefined

  const shared = {
    id,
    name,
    defaultValue: defaultValue ?? '',
    disabled,
    placeholder,
    $invalid: !!error,
    'aria-invalid': !!error,
    'aria-describedby': describedBy,
    onInput: softLimit
      ? (event: { currentTarget: { value: string } }) =>
          setLength(event.currentTarget.value.length)
      : undefined,
  }

  return (
    <F.Field data-wide={wide || undefined}>
      <F.Label htmlFor={id}>
        {label}
        {badge ? <F.Optional>{badge}</F.Optional> : optional && <F.Optional>Optional</F.Optional>}
      </F.Label>
      {multiline ? (
        <F.Textarea {...shared} rows={rows} />
      ) : (
        <F.Input {...shared} type={type} list={list} />
      )}
      {(hint || softLimit) && (
        <F.Hint id={`${id}-hint`}>
          <span>{hint}</span>
          {softLimit && (
            <span aria-live="polite">
              {length}/{softLimit}
            </span>
          )}
        </F.Hint>
      )}
      {error && (
        <F.ErrorText id={`${id}-error`}>
          <CircleAlert size={14} strokeWidth={2.25} aria-hidden="true" />
          {error}
        </F.ErrorText>
      )}
    </F.Field>
  )
}
