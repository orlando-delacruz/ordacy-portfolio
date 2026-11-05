import { ArrowRight, Check, Users } from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { services } from '@/data'
import * as S from './styles/service-explorer.styled'

/** Tabbed service detail: list of services, one detailed panel at a time. */
export function ServiceExplorer() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const service = services[active]

  if (!service) return null
  const Icon = service.icon

  const onKeyDown = (event: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: services.length - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    const next = (keys[event.key] + services.length) % services.length
    setActive(next)
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus()
  }

  return (
    <S.Explorer>
      <S.TabList ref={listRef} role="tablist" aria-label="Services" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {services.map((item, index) => {
          const TabIcon = item.icon
          return (
            <S.Tab
              key={item.id}
              id={`service-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls="service-panel"
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
            >
              <TabIcon size={18} strokeWidth={2} aria-hidden="true" />
              {item.title}
            </S.Tab>
          )
        })}
      </S.TabList>

      <S.Panel id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${service.id}`}>
        <S.PanelHead>
          <S.PanelIcon aria-hidden="true">
            <Icon size={22} strokeWidth={2} />
          </S.PanelIcon>
          <div>
            <S.PanelTitle>{service.title}</S.PanelTitle>
            <S.PanelText>{service.description}</S.PanelText>
          </div>
        </S.PanelHead>

        <S.Problem>
          <S.Label>The problem it solves</S.Label>
          <p>{service.problem}</p>
        </S.Problem>

        <S.Columns>
          <div>
            <S.Label as="h4">What it can include</S.Label>
            <S.Checks>
              {service.capabilities.map((capability) => (
                <li key={capability}>
                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                  {capability}
                </li>
              ))}
            </S.Checks>
          </div>
          <div>
            <S.Label as="h4">Typical use cases</S.Label>
            <S.Bullets>
              {service.useCases.map((useCase) => (
                <li key={useCase}>{useCase}</li>
              ))}
            </S.Bullets>
          </div>
        </S.Columns>

        <S.Footer>
          <S.Audience>
            <Users size={18} strokeWidth={2} aria-hidden="true" />
            <span>
              <strong>Best for:</strong> {service.audience}
            </span>
          </S.Audience>
          <S.Cta to="/contact">
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            Discuss this service
          </S.Cta>
        </S.Footer>
      </S.Panel>
    </S.Explorer>
  )
}
