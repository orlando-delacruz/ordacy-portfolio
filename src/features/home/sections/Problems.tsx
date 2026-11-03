import styled from 'styled-components'
import { Section } from '../components/Section'
import { problems } from '../home.data'

const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const Card = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }
`

const IconBadge = styled.span`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

const CardTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: -0.01em;
`

const CardText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export function Problems() {
  return (
    <Section
      id="problems"
      title="Your Business Deserves Better Systems."
      description="As your business grows, disconnected tools and manual processes can make everyday operations harder to manage. We build digital solutions that bring your workflows together."
    >
      <Grid>
        {problems.map((problem) => {
          const Icon = problem.icon

          return (
            <Card key={problem.title}>
              <IconBadge>
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </IconBadge>
              <CardTitle>{problem.title}</CardTitle>
              <CardText>{problem.description}</CardText>
            </Card>
          )
        })}
      </Grid>
    </Section>
  )
}
