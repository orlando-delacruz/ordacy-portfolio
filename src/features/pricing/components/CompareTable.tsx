import { plans } from '@/features/home/home.data'
import * as S from '../styles/pricing-page.styled'

const priceFor = (plan: (typeof plans)[number]) =>
  plan.prices.PHP && plan.prices.USD
    ? `${plan.prices.PHP} / ${plan.prices.USD}`
    : 'Quoted per project'

export function CompareTable() {
  return (
    <div role="region" aria-label="Plan comparison">
      <S.TableWrap>
        <S.Table>
          <caption>Comparison of Starter, Growth, and Custom plans</caption>
          <thead>
            <tr>
              <th scope="col">Details</th>
              {plans.map((plan) => {
                const Icon = plan.icon
                return (
                  <S.PlanHead
                    key={plan.id}
                    scope="col"
                    $featured={plan.id === 'growth'}
                  >
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
                    {priceFor(plan)}
                  </S.Price>
                </S.PlanCell>
              ))}
            </tr>
          </tbody>
        </S.Table>
      </S.TableWrap>

      <S.CompareStack>
        {plans.map((plan) => {
          const Icon = plan.icon
          const featured = plan.id === 'growth'

          return (
            <S.ComparePlan key={plan.id} $featured={featured}>
              <S.ComparePlanHead>
                <S.PlanIcon aria-hidden="true">
                  <Icon size={18} strokeWidth={2} aria-hidden="true" />
                </S.PlanIcon>
                <h3>{plan.name}</h3>
              </S.ComparePlanHead>

              <S.CompareDetails>
                <S.CompareRow>
                  <dt>Best for</dt>
                  <dd>{plan.positioning}</dd>
                </S.CompareRow>
                <S.CompareRow>
                  <dt>Good fit</dt>
                  <dd>
                    <S.List>
                      {plan.fits.map((fit) => (
                        <li key={fit}>{fit}</li>
                      ))}
                    </S.List>
                  </dd>
                </S.CompareRow>
                <S.CompareRow>
                  <dt>Starting price</dt>
                  <dd>
                    <S.ComparePrice $featured={featured}>
                      {priceFor(plan)}
                    </S.ComparePrice>
                  </dd>
                </S.CompareRow>
              </S.CompareDetails>
            </S.ComparePlan>
          )
        })}
      </S.CompareStack>
    </div>
  )
}
