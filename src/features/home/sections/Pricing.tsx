import { Check, Send } from 'lucide-react'
import { useState } from 'react'
import { Section } from '../components/Section'
import type { Currency } from '../home.data'
import { plans, pricingNotes } from '../home.data'
import * as S from './styles/pricing.styled'

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>('PHP')

  return (
    <Section
      id="pricing"
      title="Clear Starting Prices."
      description="Honest pricing, scoped to fit."
    >
      <S.Toolbar>
        <S.ToolbarLabel id="pricing-currency-label">
          Show prices in
        </S.ToolbarLabel>
        <S.Toggle role="group" aria-labelledby="pricing-currency-label">
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
      </S.Toolbar>

      {/* Focusable so keyboard users can scroll the card row on small screens. */}
      <S.Grid role="region" aria-label="Pricing plans" tabIndex={0}>
        {plans.map((plan) => {
          const price = plan.prices[currency]
          const featured = plan.id === 'growth'
          const Button = featured ? S.PrimaryButton : S.SecondaryButton
          const CtaIcon = plan.ctaIcon
          const PlanIcon = plan.icon

          return (
            <S.Card key={plan.id} $featured={featured}>
              {featured && <S.FeaturedBadge>Recommended</S.FeaturedBadge>}
              <S.CardHeader>
                <S.PlanIcon>
                  <PlanIcon size={22} strokeWidth={2} aria-hidden="true" />
                </S.PlanIcon>
                <S.NameRow>
                  <S.PlanName>{plan.name}</S.PlanName>
                  <S.Category>{plan.category}</S.Category>
                </S.NameRow>
              </S.CardHeader>

              <S.PriceBlock $featured={featured}>
                <S.PriceLabel>
                  {price ? 'Starting at' : 'Priced per project'}
                </S.PriceLabel>
                <S.Price $featured={featured}>
                  {featured && price ? (
                    <>
                      {/* Price strings start with the symbol (₱ / $). */}
                      <S.Currency>{price.slice(0, 1)}</S.Currency>
                      {price.slice(1)}
                    </>
                  ) : (
                    (price ?? 'Custom quote')
                  )}
                </S.Price>
                <S.PriceNote>
                  {price
                    ? `${currency} · final quote after scoping`
                    : 'Quoted after we review your requirements'}
                </S.PriceNote>
              </S.PriceBlock>

              <S.Positioning>{plan.positioning}</S.Positioning>

              <S.FitList aria-label={`Good fit for ${plan.name}`}>
                {plan.fits.map((fit) => (
                  <S.FitItem key={fit}>
                    <S.FitIcon>
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                    </S.FitIcon>
                    {fit}
                  </S.FitItem>
                ))}
              </S.FitList>

              <S.CardAction>
                <Button to="/contact">
                  <CtaIcon size={18} strokeWidth={2} aria-hidden="true" />
                  {plan.cta}
                </Button>
              </S.CardAction>
            </S.Card>
          )
        })}
      </S.Grid>

      <S.Notes>
        {pricingNotes.map((note) => {
          const Icon = note.icon

          return (
            <S.Note key={note.title}>
              <S.NoteIcon>
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
              </S.NoteIcon>
              <div>
                <S.NoteTitle>{note.title}</S.NoteTitle>
                <S.NoteText>{note.description}</S.NoteText>
              </div>
            </S.Note>
          )
        })}
      </S.Notes>

      <S.Help>
        <div>
          <S.HelpTitle>Not sure which plan fits?</S.HelpTitle>
          <S.HelpText>
            Share what you need and we'll suggest the right scope.
          </S.HelpText>
        </div>
        <S.SecondaryButton to="/contact">
          <Send size={18} strokeWidth={2} aria-hidden="true" />
          Tell us about your project
        </S.SecondaryButton>
      </S.Help>
    </Section>
  )
}
