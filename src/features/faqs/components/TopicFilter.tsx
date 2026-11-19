import * as S from '../styles/topic-filter.styled'

type Topic = {
  value: string
  label: string
  count: number
}

type TopicFilterProps = {
  options: readonly Topic[]
  value: string
  onChange: (value: string) => void
}

/** Topic buttons: scrollable pills on phones, a full-width list on desktop. */
export function TopicFilter({ options, value, onChange }: TopicFilterProps) {
  return (
    <S.Nav aria-label="Filter questions by topic">
      <S.List>
        {options.map((option) => {
          const active = option.value === value

          return (
            <S.Item key={option.value}>
              <S.Button
                type="button"
                $active={active}
                aria-pressed={active}
                aria-label={`${option.label}, ${option.count}`}
                onClick={() => onChange(option.value)}
              >
                <span>{option.label}</span>
                <S.Count>{option.count}</S.Count>
              </S.Button>
            </S.Item>
          )
        })}
      </S.List>
    </S.Nav>
  )
}
