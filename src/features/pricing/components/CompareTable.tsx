import { plans } from '@/features/home/home.data'
import * as S from '../styles/pricing-page.styled'

export function CompareTable() {
  return (
    <S.TableWrap role="region" aria-label="Plan comparison" tabIndex={0}>
      <S.Table>
        <caption>Comparison of Starter, Growth, and Custom plans</caption>
        <thead>
          <tr>
            <th scope="col">Details</th>
            {plans.map((plan) => {
              const Icon = plan.icon
              return (
                <S.PlanHead key={plan.id} scope="col" $featured={plan.id === 'growth'}>
                  <S.PlanName>
                    <S.PlanIcon aria-hidden="true">
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    </S.PlanIcon>
                    {plan.name}
                  </S.PlanName>
                </S.PlanHead>
              )
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Best for</th>
            {plans.map((plan) => (
              <S.PlanCell key={plan.id} $featured={plan.id === 'growth'}>
                {plan.positioning}
              </S.PlanCell>
            ))}
          </tr>
          <tr>
            <th scope="row">Good fit</th>
            {plans.map((plan) => (
              <S.PlanCell key={plan.id} $featured={plan.id === 'growth'}>
                <S.List>
                  {plan.fits.map((fit) => (
                    <li key={fit}>{fit}</li>
                  ))}
                </S.List>
              </S.PlanCell>
            ))}
          </tr>
          <tr>
            <th scope="row">Starting price</th>
            {plans.map((plan) => (
              <S.PlanCell key={plan.id} $featured={plan.id === 'growth'}>
                <S.Price $featured={plan.id === 'growth'}>
                  {plan.prices.PHP && plan.prices.USD
                    ? `${plan.prices.PHP} / ${plan.prices.USD}`
                    : 'Quoted per project'}
                </S.Price>
              </S.PlanCell>
            ))}
          </tr>
        </tbody>
      </S.Table>
    </S.TableWrap>
  )
}
