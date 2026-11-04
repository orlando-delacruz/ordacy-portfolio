import { Section } from '../components/Section'
import { services } from '../home.data'
import * as S from './styles/services.styled'

export function Services() {
  return (
    <Section
      id="services"
      title="Digital Solutions Built Around Your Business."
      description="Every business works differently. We develop practical digital solutions based on your operations, customers, and specific requirements."
    >
      <S.Grid>
        {services.map((service) => {
          const Icon = service.icon

          return (
            <S.Card key={service.title}>
              <S.IconBadge>
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </S.IconBadge>
              <S.CardTitle>{service.title}</S.CardTitle>
              <S.CardText>{service.description}</S.CardText>
            </S.Card>
          )
        })}
      </S.Grid>
    </Section>
  )
}
