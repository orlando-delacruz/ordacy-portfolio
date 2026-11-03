import { useState } from 'react'
import styled from 'styled-components'
import { PrimaryButton } from '../components/Buttons'
import { Section } from '../components/Section'
import type { Currency } from '../home.data'
import { plans } from '../home.data'

const Toggle = styled.div`
  display: inline-flex;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface.default};
`

const ToggleOption = styled.button<{ $selected: boolean }>`
  min-height: 2.75rem;
  padding: ${({ theme }) => theme.spacing.xs}
    ${({ theme }) => theme.spacing.lg};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.background.subtle : 'transparent'};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.text.accent : theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ $selected, theme }) =>
    $selected
      ? theme.typography.fontWeights.semibold
      : theme.typography.fontWeights.medium};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};
`

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
  }
`

const Card = styled.article<{ $featured: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid
    ${({ $featured, theme }) =>
      $featured ? theme.colors.text.accent : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  box-shadow: ${({ $featured, theme }) =>
    $featured ? theme.shadows.md : 'none'};
`

const PlanName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

const Price = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
`

const PriceNote = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
`

const Positioning = styled.p`
  flex: 1;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

const MaintenanceNote = styled.p`
  margin: ${({ theme }) => theme.spacing.xl} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>('PHP')

  return (
    <Section
      id="pricing"
      title="Clear Starting Prices. Solutions That Fit Your Business."
      description="Explore our starting packages to get an idea of the investment. Final pricing depends on your requirements, features, and project scope."
    >
      <Toggle role="group" aria-label="Currency">
        {(['PHP', 'USD'] as const).map((option) => (
          <ToggleOption
            key={option}
            type="button"
            $selected={currency === option}
            aria-pressed={currency === option}
            onClick={() => setCurrency(option)}
          >
            {option === 'PHP' ? 'PHP ₱' : 'USD $'}
          </ToggleOption>
        ))}
      </Toggle>
      <Grid>
        {plans.map((plan) => {
          const price = plan.prices[currency]

          return (
            <Card key={plan.id} $featured={plan.id === 'growth'}>
              <PlanName>{plan.name}</PlanName>
              <Price>
                {price ?? 'Custom Quote'}
                {price && (
                  <PriceNote> starting price in {currency}</PriceNote>
                )}
              </Price>
              <Positioning>{plan.positioning}</Positioning>
              <PrimaryButton to="/contact">{plan.cta}</PrimaryButton>
            </Card>
          )
        })}
      </Grid>
      <MaintenanceNote>
        Maintenance is optional and quoted separately.
      </MaintenanceNote>
    </Section>
  )
}
