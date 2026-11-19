import { Lightbulb, MessagesSquare, TriangleAlert } from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { problems, services } from '@/data'
import * as S from './styles/mobile-systems.styled'

type Panel = 'problems' | 'solutions'

const panels: readonly Panel[] = ['problems', 'solutions']

const tabId = (panel: Panel) => `mobile-systems-tab-${panel}`
const panelId = (panel: Panel) => `mobile-systems-panel-${panel}`
const problemButtonId = (problemId: string) => `mobile-systems-problem-${problemId}`
const problemContentId = (problemId: string) =>
  `mobile-systems-problem-${problemId}-content`

/** Mobile-only problem accordion and the services that solve each one. */
export function MobileSystems({
  onSelectService,
}: {
  onSelectService: (serviceId: string) => void
}) {
  const [panel, setPanel] = useState<Panel>('problems')
  const [openProblem, setOpenProblem] = useState<number | null>(null)
  const tabRefs = useRef<Record<Panel, HTMLButtonElement | null>>({
    problems: null,
    solutions: null,
  })

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = panels.indexOf(panel)
    let next: number | null = null

    if (event.key === 'ArrowRight') next = (current + 1) % panels.length
    if (event.key === 'ArrowLeft') next = (current - 1 + panels.length) % panels.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = panels.length - 1
    if (next === null) return

    event.preventDefault()
    const target = panels[next]
    setPanel(target)
    tabRefs.current[target]?.focus()
  }

  return (
    <>
      <S.Switcher
        role="tablist"
        aria-label="Problems and solutions"
        onKeyDown={onTabKeyDown}
      >
        <S.SwitchTab
          ref={(node) => {
            tabRefs.current.problems = node
          }}
          id={tabId('problems')}
          type="button"
          role="tab"
          aria-selected={panel === 'problems'}
          aria-controls={panelId('problems')}
          tabIndex={panel === 'problems' ? 0 : -1}
          onClick={() => setPanel('problems')}
        >
          <TriangleAlert size={18} strokeWidth={2} aria-hidden="true" />
          Problem
        </S.SwitchTab>
        <S.SwitchTab
          ref={(node) => {
            tabRefs.current.solutions = node
          }}
          id={tabId('solutions')}
          type="button"
          role="tab"
          aria-selected={panel === 'solutions'}
          aria-controls={panelId('solutions')}
          tabIndex={panel === 'solutions' ? 0 : -1}
          onClick={() => setPanel('solutions')}
        >
          <Lightbulb size={18} strokeWidth={2} aria-hidden="true" />
          Solution
        </S.SwitchTab>
      </S.Switcher>

      <S.Panel
        id={panelId('problems')}
        role="tabpanel"
        aria-labelledby={tabId('problems')}
        hidden={panel !== 'problems'}
      >
        <S.List>
          {problems.map((problem, index) => {
            const Icon = problem.icon
            const open = openProblem === index
            const addressedServices = problem.solvedBy.flatMap((title) => {
              const service = services.find((item) => item.title === title)
              return service ? [service] : []
            })

            return (
              <S.Row key={problem.id}>
                <S.RowButton
                  id={problemButtonId(problem.id)}
                  type="button"
                  aria-expanded={open}
                  aria-controls={problemContentId(problem.id)}
                  onClick={() => setOpenProblem(open ? null : index)}
                >
                  <S.IconTile aria-hidden="true">
                    <Icon size={20} strokeWidth={2} />
                  </S.IconTile>
                  <S.RowBody>
                    <S.RowTitle>{problem.title}</S.RowTitle>
                    <S.RowSummary>{problem.mobileSummary}</S.RowSummary>
                  </S.RowBody>
                </S.RowButton>

                <S.Region
                  id={problemContentId(problem.id)}
                  role="region"
                  aria-labelledby={problemButtonId(problem.id)}
                  hidden={!open}
                >
                  <S.Description>{problem.description}</S.Description>
                  <S.HelpLabel>How Ordacy helps</S.HelpLabel>
                  <S.HelpList>
                    {addressedServices.map((service) => {
                      const ServiceIcon = service.icon
                      return (
                        <li key={service.id}>
                          <S.ServiceButton
                            type="button"
                            onClick={() => onSelectService(service.id)}
                          >
                            <ServiceIcon
                              size={18}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                            {service.title}
                          </S.ServiceButton>
                        </li>
                      )
                    })}
                  </S.HelpList>
                  <S.Cta to="/contact">
                    <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
                    Discuss your project
                  </S.Cta>
                </S.Region>
              </S.Row>
            )
          })}
        </S.List>
      </S.Panel>

      <S.Panel
        id={panelId('solutions')}
        role="tabpanel"
        aria-labelledby={tabId('solutions')}
        hidden={panel !== 'solutions'}
      >
        <S.List>
          {services.map((service) => {
            const Icon = service.icon
            return (
              <S.Row key={service.id}>
                <S.RowButton
                  type="button"
                  aria-label={service.title}
                  onClick={() => onSelectService(service.id)}
                >
                  <S.IconTile aria-hidden="true">
                    <Icon size={20} strokeWidth={2} />
                  </S.IconTile>
                  <S.RowBody>
                    <S.RowTitle>{service.title}</S.RowTitle>
                    <S.ClampedSummary>{service.description}</S.ClampedSummary>
                  </S.RowBody>
                </S.RowButton>
              </S.Row>
            )
          })}
        </S.List>
      </S.Panel>
    </>
  )
}
