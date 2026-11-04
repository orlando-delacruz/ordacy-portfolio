import { useState } from 'react'
import { Section } from '../components/Section'
import type { Currency } from '../home.data'
import { plans } from '../home.data'
import * as S from './styles/pricing.styled'

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>('PHP')

  return (
    <Section
      id="pricing"
      title="Clear Starting Prices. Solutions That Fit Your Business."
      description="Explore our starting packages to get an idea of the investment. Final pricing depends on your requirements, features, and project scope."
    >
      <S.Toggle role="group" aria-label="Currency">
        {(['PHP', 'USD'] as const).map((option) => (
          <S.ToggleOption
            key={option}
            type="button"
            $selected={currency === option}
            aria-pressed={currency === option}
            onClick={() => setCurrency(option)}
          >
            {option === 'PHP' ? 'PHP ₱' : 'USD $'}
          </S.ToggleOption>
        ))}
      </S.Toggle>
      <S.Grid>
        {plans.map((plan) => {
          const price = plan.prices[currency]

          return (
            <S.Card key={plan.id} $featured={plan.id === 'growth'}>
              <S.PlanName>{plan.name}</S.PlanName>
              <S.Price>
                {price ?? 'Custom Quote'}
                {price && (
                  <S.PriceNote> starting price in {currency}</S.PriceNote>
                )}
              </S.Price>
              <S.Positioning>{plan.positioning}</S.Positioning>
              <S.PrimaryButton to="/contact">{plan.cta}</S.PrimaryButton>
            </S.Card>
          )
        })}
      </S.Grid>
      <S.MaintenanceNote>
        Maintenance is optional and quoted separately.
      </S.MaintenanceNote>
    </Section>
  )
}
