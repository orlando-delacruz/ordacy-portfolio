import { ArrowRight, Award, Check } from 'lucide-react'
import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { services } from '@/data'
import * as S from './styles/service-explorer.styled'

type ServiceExplorerProps = {
  activeId: string
  onSelect: (id: string) => void
}

/** Controlled vertical tablist of services with the selected service's detail. */
export function ServiceExplorer({ activeId, onSelect }: ServiceExplorerProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const service = services.find((item) => item.id === activeId) ?? services[0]

  if (!service) return null

  const activeIndex = services.findIndex((item) => item.id === service.id)
  const Icon = service.icon

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = activeIndex + 1
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        next = activeIndex - 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = services.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    const targetIndex = (next + services.length) % services.length
    const target = services[targetIndex]
    if (!target) return
    onSelect(target.id)
    tabRefs.current[targetIndex]?.focus()
  }

  return (
    <S.Explorer>
      <S.TabList
        role="tablist"
        aria-label="Services"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
      >
        {services.map((item, index) => {
          const TabIcon = item.icon
          return (
            <S.Tab
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              id={`service-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={item.id === service.id}
              aria-controls="service-panel"
              tabIndex={item.id === service.id ? 0 : -1}
              onClick={() => onSelect(item.id)}
            >
              <TabIcon size={20} strokeWidth={2} aria-hidden="true" />
              {item.title}
            </S.Tab>
          )
        })}
      </S.TabList>

      <S.Panel
        id="service-panel"
        role="tabpanel"
        aria-labelledby={`service-tab-${service.id}`}
      >
        <S.PanelHead>
          <S.PanelIcon aria-hidden="true">
            <Icon size={24} strokeWidth={2} />
          </S.PanelIcon>
          <div>
            <S.PanelTitle>{service.title}</S.PanelTitle>
            <S.PanelDescription>{service.description}</S.PanelDescription>
          </div>
        </S.PanelHead>

        <S.Problem>
          <S.ProblemLabel>The problem it solves</S.ProblemLabel>
          <S.ProblemText>{service.problem}</S.ProblemText>
        </S.Problem>

        <S.Columns>
          <div>
            <S.Label as="h4">What it can include</S.Label>
            <S.List>
              {service.capabilities.map((capability) => (
                <li key={capability}>
                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                  {capability}
                </li>
              ))}
            </S.List>
          </div>
          <div>
            <S.Label as="h4">Typical use cases</S.Label>
            <S.List>
              {service.useCases.map((useCase) => (
                <li key={useCase}>
                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                  {useCase}
                </li>
              ))}
            </S.List>
          </div>
        </S.Columns>

        <S.Footer>
          <S.Audience>
            <Award size={18} strokeWidth={2} aria-hidden="true" />
            <span>
              <strong>Best for:</strong> {service.audience}
            </span>
          </S.Audience>
          <S.Cta to="/contact">
            Discuss this service
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </S.Cta>
        </S.Footer>
      </S.Panel>
    </S.Explorer>
  )
}
