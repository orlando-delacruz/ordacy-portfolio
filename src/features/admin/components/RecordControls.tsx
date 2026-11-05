import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react'
import { createElement } from 'react'
import type { MouseEvent } from 'react'
import { iconNames, resolveIcon } from '@/data'
import * as F from './styles/form.styled'
import * as S from './styles/admin-ui.styled'

type OrderButtonsProps = {
  label: string
  index: number
  count: number
  onMove: (delta: number) => void
}

/** Move up/down buttons for ordered content lists. */
export function OrderButtons({ label, index, count, onMove }: OrderButtonsProps) {
  return (
    <>
      <S.IconButton
        type="button"
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => onMove(-1)}
      >
        <ArrowUp size={16} strokeWidth={2} aria-hidden="true" />
      </S.IconButton>
      <S.IconButton
        type="button"
        aria-label={`Move ${label} down`}
        disabled={index === count - 1}
        onClick={() => onMove(1)}
      >
        <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
      </S.IconButton>
    </>
  )
}

type EditDeleteProps = {
  label: string
  onEdit: (event: MouseEvent<HTMLButtonElement>) => void
  onDelete?: (event: MouseEvent<HTMLButtonElement>) => void
}

export function EditDeleteButtons({ label, onEdit, onDelete }: EditDeleteProps) {
  return (
    <>
      <S.IconButton
        type="button"
        aria-label={`Edit ${label}`}
        aria-haspopup="dialog"
        onClick={onEdit}
      >
        <Pencil size={16} strokeWidth={2} aria-hidden="true" />
      </S.IconButton>
      {onDelete && (
        <S.IconButton
          type="button"
          $danger
          aria-label={`Delete ${label}`}
          aria-haspopup="dialog"
          onClick={onDelete}
        >
          <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
        </S.IconButton>
      )}
    </>
  )
}

type IconSelectProps = {
  id: string
  name: string
  defaultValue: string
}

/** Picks one of the icons the data layer can resolve. */
export function IconSelect({ id, name, defaultValue }: IconSelectProps) {
  return (
    <F.Select id={id} name={name} defaultValue={defaultValue}>
      {iconNames.map((icon) => (
        <option key={icon} value={icon}>
          {icon}
        </option>
      ))}
    </F.Select>
  )
}

type DataIconProps = { name: string; size?: number }

/** Renders an icon stored by name in the data layer (decorative). */
export function DataIcon({ name, size = 20 }: DataIconProps) {
  // createElement: the component comes from a static lookup table, not from render.
  return createElement(resolveIcon(name), {
    size,
    strokeWidth: 2,
    'aria-hidden': true,
  })
}
