import { Section } from '../components/Section'
import { problems } from '../home.data'
import * as S from './styles/problems.styled'

export function Problems() {
  return (
    <Section
      id="problems"
      title="Your Business Deserves Better Systems."
      description="As your business grows, disconnected tools and manual processes can make everyday operations harder to manage. We build digital solutions that bring your workflows together."
    >
      <S.Grid>
        {problems.map((problem) => {
          const Icon = problem.icon

          return (
            <S.Card key={problem.title}>
              <S.IconBadge>
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </S.IconBadge>
              <S.CardTitle>{problem.title}</S.CardTitle>
              <S.CardText>{problem.description}</S.CardText>
            </S.Card>
          )
        })}
      </S.Grid>
    </Section>
  )
}
