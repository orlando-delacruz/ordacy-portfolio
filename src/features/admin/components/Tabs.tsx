import type { LucideIcon } from 'lucide-react'
import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import * as S from './styles/tabs.styled'

export type TabItem = { id: string; label: string; icon: LucideIcon }

type TabsProps = {
  label: string
  tabs: readonly TabItem[]
  active: string
  onChange: (id: string) => void
  children: ReactNode
}

/** WAI-ARIA tabs: arrow keys, Home and End move between tabs. */
export function Tabs({ label, tabs, active, onChange, children }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (event: KeyboardEvent) => {
    const index = tabs.findIndex((tab) => tab.id === active)
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft'
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : -1
    if (next < 0) return
    event.preventDefault()
    onChange(tabs[next].id)
    listRef.current
      ?.querySelector<HTMLButtonElement>(`#tab-${tabs[next].id}`)
      ?.focus()
  }

  return (
    <S.Wrapper>
      <S.List ref={listRef} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {tabs.map(({ id, label: tabLabel, icon: Icon }) => (
          <S.Tab
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={id === active}
            aria-controls={`tabpanel-${id}`}
            tabIndex={id === active ? 0 : -1}
            onClick={() => onChange(id)}
          >
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
            {tabLabel}
          </S.Tab>
        ))}
      </S.List>
      <div role="tabpanel" id={`tabpanel-${active}`} aria-labelledby={`tab-${active}`}>
        {children}
      </div>
    </S.Wrapper>
  )
}
