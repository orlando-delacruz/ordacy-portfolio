import { ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import * as S from './styles/select-field.styled'

type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  id: string
  name: string
  label: string
  optional?: boolean
  icon: LucideIcon
  options: readonly SelectOption[]
  defaultValue?: string
}

/**
 * Branded native select: the OS keeps the accessible option list, while the
 * field gets the leading icon, custom chevron, 44px height and focus ring.
 */
export function SelectField({
  id,
  name,
  label,
  optional,
  icon: Icon,
  options,
  defaultValue,
}: SelectFieldProps) {
  return (
    <S.Field>
      <S.Label htmlFor={id}>
        {label}
        {optional && <S.Optional>(optional)</S.Optional>}
      </S.Label>
      <S.Control>
        <S.LeadingIcon aria-hidden="true">
          <Icon size={16} strokeWidth={2} />
        </S.LeadingIcon>
        <S.Select id={id} name={name} defaultValue={defaultValue}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </S.Select>
        <S.Chevron aria-hidden="true">
          <ChevronDown size={18} strokeWidth={2} />
        </S.Chevron>
      </S.Control>
    </S.Field>
  )
}
