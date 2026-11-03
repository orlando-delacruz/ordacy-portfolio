import styled from 'styled-components'
import { Section } from '../components/Section'
import { steps } from '../home.data'

const Timeline = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

const Step = styled.li`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

const StepNumber = styled.span`
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
`

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const IconBadge = styled.span`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

const StepTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

const StepText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export function Process() {
  return (
    <Section
      id="process"
      title="From Business Challenge to Working Solution."
      description="A clear development process helps keep your project organized, aligned, and moving toward the right outcome."
    >
      <Timeline>
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <Step key={step.title}>
              <StepNumber aria-hidden="true">
                Step {index + 1}
              </StepNumber>
              <StepHeader>
                <IconBadge>
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                </IconBadge>
                <StepTitle>{step.title}</StepTitle>
              </StepHeader>
              <StepText>{step.description}</StepText>
            </Step>
          )
        })}
      </Timeline>
    </Section>
  )
}
