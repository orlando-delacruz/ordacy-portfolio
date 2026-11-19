import { MessagesSquare } from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { problems, services } from '@/data'
import * as S from './styles/address-explorer.styled'

const tabId = (problemId: string) => `address-tab-${problemId}`

/** Problem list plus the detail panel, with the services that address it. */
export function AddressExplorer({
  onSelectService,
}: {
  onSelectService: (serviceId: string) => void
}) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const problem = problems[active]

  if (!problem) return null
  const ProblemIcon = problem.icon
  const addressedServices = problem.solvedBy.flatMap((title) => {
    const service = services.find((item) => item.title === title)
    return service ? [service] : []
  })

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: problems.length - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    const next = (keys[event.key] + problems.length) % problems.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <S.Explorer>
      <S.TabList
        role="tablist"
        aria-label="Business problems"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {problems.map((item, index) => {
          const Icon = item.icon
          const selected = index === active
          return (
            <S.Tab
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              id={tabId(item.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="address-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
            >
              <S.TabIcon aria-hidden="true">
                <Icon size={20} strokeWidth={2} />
              </S.TabIcon>
              <S.TabBody>
                <S.TabTitle>{item.title}</S.TabTitle>
                <S.TabSummary>{item.summary}</S.TabSummary>
              </S.TabBody>
            </S.Tab>
          )
        })}
      </S.TabList>

      <S.Panel
        id="address-panel"
        role="tabpanel"
        aria-labelledby={tabId(problem.id)}
      >
        <S.Intro>
          <S.Rule aria-hidden="true" />
          <S.PanelHeading>What holds businesses back?</S.PanelHeading>
        </S.Intro>

        <S.PanelHead>
          <S.PanelIcon aria-hidden="true">
            <ProblemIcon size={24} strokeWidth={2} />
          </S.PanelIcon>
          <div>
            <S.PanelTitle>{problem.title}</S.PanelTitle>
            <S.PanelText>{problem.description}</S.PanelText>
          </div>
        </S.PanelHead>

        <S.Divider />

        <S.Help>
          <S.HelpTitle>How Ordacy helps</S.HelpTitle>
          <S.HelpList>
            {addressedServices.map((service) => {
              const ServiceIcon = service.icon
              return (
                <li key={service.id}>
                  <S.HelpLink
                    type="button"
                    onClick={() => onSelectService(service.id)}
                  >
                    <ServiceIcon size={18} strokeWidth={2} aria-hidden="true" />
                    {service.title}
                  </S.HelpLink>
                </li>
              )
            })}
          </S.HelpList>
        </S.Help>

        <S.Cta to="/contact">
          <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
          Discuss your project
        </S.Cta>
      </S.Panel>
    </S.Explorer>
  )
}
