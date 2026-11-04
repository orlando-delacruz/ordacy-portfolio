import {
  ChevronRight,
  CircleCheck,
  MessagesSquare,
  TriangleAlert,
} from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import { useTheme } from 'styled-components'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Section } from '../components/Section'
import { problems, services } from '../home.data'
import * as S from './styles/systems.styled'

type TabId = 'problems' | 'solutions'

const tabs = [
  {
    id: 'problems',
    label: 'Problem',
    description: 'What holds businesses back.',
    relatedLabel: 'How Ordacy helps',
    items: problems,
    tone: 'problem',
    TabIcon: TriangleAlert,
  },
  {
    id: 'solutions',
    label: 'Solution',
    description: 'What Ordacy builds.',
    relatedLabel: 'Problems it solves',
    items: services,
    tone: 'solution',
    TabIcon: CircleCheck,
  },
] as const

type Tab = (typeof tabs)[number]
type Related = { tabId: TabId; index: number }

// Problem → services comes from `solvedBy`; service → problems is the reverse lookup.
function relatedItems(tabId: TabId, index: number): Related[] {
  if (tabId === 'problems') {
    return problems[index].solvedBy
      .map((title) => ({
        tabId: 'solutions' as const,
        index: services.findIndex((service) => service.title === title),
      }))
      .filter((related) => related.index >= 0)
  }

  const title = services[index].title
  return problems.flatMap((problem, problemIndex) =>
    problem.solvedBy.includes(title)
      ? [{ tabId: 'problems' as const, index: problemIndex }]
      : [],
  )
}

const itemsFor = (tabId: TabId) => (tabId === 'problems' ? problems : services)

/* ---------- Shared Problem / Solution tab bar ---------- */

type SystemTabsProps = {
  active: TabId
  onChange: (id: TabId) => void
  idPrefix: string
  inline?: boolean
}

function SystemTabs({ active, onChange, idPrefix, inline }: SystemTabsProps) {
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({})

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    const next: TabId = active === 'problems' ? 'solutions' : 'problems'
    onChange(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <S.TabList
      role="tablist"
      aria-label="Problems and solutions"
      $inline={inline}
    >
      {tabs.map((tab) => (
        <S.Tab
          key={tab.id}
          ref={(element) => {
            tabRefs.current[tab.id] = element
          }}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${tab.id}`}
          aria-selected={active === tab.id}
          aria-controls={`${idPrefix}-panel-${tab.id}`}
          tabIndex={active === tab.id ? 0 : -1}
          $active={active === tab.id}
          $tone={tab.tone}
          onClick={() => onChange(tab.id)}
          onKeyDown={handleKeyDown}
        >
          {inline && (
            <tab.TabIcon size={18} strokeWidth={2} aria-hidden="true" />
          )}
          {tab.label}
        </S.Tab>
      ))}
    </S.TabList>
  )
}

/* ---------- Mobile: tabs + accordion ---------- */

type AccordionProps = {
  tab: Tab
  openIndex: number | null
  onToggle: (index: number | null) => void
}

function Accordion({ tab, openIndex, onToggle }: AccordionProps) {
  return (
    <S.AccordionList>
      {tab.items.map((item, index) => {
        const Icon = item.icon
        const open = openIndex === index
        const baseId = `systems-${tab.id}-${index}`

        return (
          <S.AccordionItem key={item.title}>
            <S.AccordionHeading>
              <S.AccordionButton
                type="button"
                id={`${baseId}-button`}
                aria-expanded={open}
                aria-controls={`${baseId}-text`}
                onClick={() => onToggle(open ? null : index)}
              >
                <S.Badge $tone={tab.tone}>
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                </S.Badge>
                <S.AccordionTitle>{item.title}</S.AccordionTitle>
                <S.ChevronWrap $open={open} $tone={tab.tone}>
                  <S.Chevron
                    $open={open}
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                </S.ChevronWrap>
              </S.AccordionButton>
            </S.AccordionHeading>
            <S.AccordionPanel
              $open={open}
              role="region"
              id={`${baseId}-text`}
              aria-labelledby={`${baseId}-button`}
            >
              <S.AccordionClip>
                <S.AccordionText>{item.description}</S.AccordionText>
              </S.AccordionClip>
            </S.AccordionPanel>
          </S.AccordionItem>
        )
      })}
    </S.AccordionList>
  )
}

function MobileTabs() {
  const [active, setActive] = useState<TabId>('problems')
  const [open, setOpen] = useState<Record<TabId, number | null>>({
    problems: null,
    solutions: null,
  })

  return (
    <>
      <SystemTabs active={active} onChange={setActive} idPrefix="systems-m" />

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`systems-m-panel-${tab.id}`}
          aria-labelledby={`systems-m-tab-${tab.id}`}
          hidden={active !== tab.id}
        >
          <S.TabDescription>{tab.description}</S.TabDescription>
          <Accordion
            tab={tab}
            openIndex={open[tab.id]}
            onToggle={(index) =>
              setOpen((current) => ({ ...current, [tab.id]: index }))
            }
          />
        </div>
      ))}
    </>
  )
}

/* ---------- Desktop: list + detail explorer ---------- */

function DesktopExplorer() {
  const [active, setActive] = useState<TabId>('problems')
  const [selected, setSelected] = useState<Record<TabId, number>>({
    problems: 0,
    solutions: 0,
  })
  const itemRefs = useRef<Record<TabId, (HTMLButtonElement | null)[]>>({
    problems: [],
    solutions: [],
  })

  const select = (tabId: TabId, index: number) =>
    setSelected((current) => ({ ...current, [tabId]: index }))

  const handleItemKeyDown = (event: KeyboardEvent, tab: Tab) => {
    const last = tab.items.length - 1
    const current = selected[tab.id]
    const next = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowUp: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key]

    if (next === undefined) return

    event.preventDefault()
    select(tab.id, next)
    itemRefs.current[tab.id][next]?.focus()
  }

  // Jumping across tabs hides the clicked link, so commit the render first, then move focus.
  const jumpTo = ({ tabId, index }: Related) => {
    flushSync(() => {
      setActive(tabId)
      select(tabId, index)
    })
    itemRefs.current[tabId][index]?.focus()
  }

  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0]

  return (
    <>
      <S.ExplorerToolbar>
        <SystemTabs
          active={active}
          onChange={setActive}
          idPrefix="systems-d"
          inline
        />
        <S.ExplorerCaption>{activeTab.description}</S.ExplorerCaption>
      </S.ExplorerToolbar>

      {tabs.map((tab) => {
        const index = selected[tab.id]
        const item = tab.items[index]
        const Icon = item.icon
        const related = relatedItems(tab.id, index)
        const detailId = `systems-d-detail-${tab.id}`

        return (
          <S.Explorer
            key={tab.id}
            role="tabpanel"
            id={`systems-d-panel-${tab.id}`}
            aria-labelledby={`systems-d-tab-${tab.id}`}
            hidden={active !== tab.id}
          >
            <S.ItemList
              role="tablist"
              aria-orientation="vertical"
              aria-label={`${tab.label} list`}
            >
              {tab.items.map((entry, entryIndex) => {
                const EntryIcon = entry.icon
                const isSelected = entryIndex === index

                return (
                  <S.ItemButton
                    key={entry.title}
                    ref={(element) => {
                      itemRefs.current[tab.id][entryIndex] = element
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={detailId}
                    tabIndex={isSelected ? 0 : -1}
                    $selected={isSelected}
                    $tone={tab.tone}
                    onClick={() => select(tab.id, entryIndex)}
                    onKeyDown={(event) => handleItemKeyDown(event, tab)}
                  >
                    <S.Badge $tone={tab.tone}>
                      <EntryIcon size={20} strokeWidth={2} aria-hidden="true" />
                    </S.Badge>
                    <S.ItemText>
                      <S.ItemTitle>{entry.title}</S.ItemTitle>
                      <S.ItemPreview aria-hidden="true">
                        {entry.description}
                      </S.ItemPreview>
                    </S.ItemText>
                    <S.ItemArrow
                      $selected={isSelected}
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </S.ItemButton>
                )
              })}
            </S.ItemList>

            <S.Detail role="tabpanel" id={detailId}>
              <S.DetailWatermark $tone={tab.tone} aria-hidden="true">
                <Icon size={200} strokeWidth={1.25} />
              </S.DetailWatermark>
              {/* Keyed so the fade-in replays on every selection. */}
              <S.DetailBody key={item.title}>
                <S.DetailIcon $tone={tab.tone}>
                  <Icon size={28} strokeWidth={2} aria-hidden="true" />
                </S.DetailIcon>
                <S.DetailTitle>{item.title}</S.DetailTitle>
                <S.DetailText>{item.description}</S.DetailText>

                {related.length > 0 && (
                  <S.Related>
                    <S.RelatedLabel>{tab.relatedLabel}</S.RelatedLabel>
                    <S.RelatedList>
                      {related.map((link) => {
                        const target = itemsFor(link.tabId)[link.index]
                        const TargetIcon = target.icon

                        return (
                          <li key={target.title}>
                            <S.RelatedButton
                              type="button"
                              onClick={() => jumpTo(link)}
                            >
                              <S.RelatedIcon
                                $tone={
                                  link.tabId === 'problems'
                                    ? 'problem'
                                    : 'solution'
                                }
                              >
                                <TargetIcon
                                  size={18}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              </S.RelatedIcon>
                              <span>{target.title}</span>
                              <ChevronRight
                                size={18}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            </S.RelatedButton>
                          </li>
                        )
                      })}
                    </S.RelatedList>
                  </S.Related>
                )}

                <S.DetailAction>
                  <S.SecondaryButton to="/contact">
                    <MessagesSquare
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Discuss your project
                  </S.SecondaryButton>
                </S.DetailAction>
              </S.DetailBody>
            </S.Detail>
          </S.Explorer>
        )
      })}
    </>
  )
}

export function Systems() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`)

  return (
    <Section
      id="services"
      title="What We Address."
      description="Problems solved, systems built."
    >
      {isDesktop ? <DesktopExplorer /> : <MobileTabs />}
    </Section>
  )
}
