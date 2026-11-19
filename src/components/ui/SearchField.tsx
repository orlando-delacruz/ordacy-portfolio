import { Search, X } from 'lucide-react'
import * as S from './styles/search-field.styled'

type SearchFieldProps = {
  id: string
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

/** Labelled search input with an icon and a 44px clear control. */
export function SearchField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: SearchFieldProps) {
  return (
    <S.Field>
      <S.Label htmlFor={id}>{label}</S.Label>
      <S.Control>
        <S.SearchIcon aria-hidden="true">
          <Search size={18} strokeWidth={2} />
        </S.SearchIcon>
        <S.Input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <S.Clear
            type="button"
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            <X size={18} strokeWidth={2} />
          </S.Clear>
        )}
      </S.Control>
    </S.Field>
  )
}
