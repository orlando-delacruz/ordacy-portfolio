import { CircleAlert, Pencil, Save, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { PlanRecord } from '@/data'
import { pagesService, plansService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import type { FieldErrors } from '../components/FormDialog'
import { DataIcon, OrderButtons } from '../components/RecordControls'
import { ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { byOrder, lines, move, text } from '../format'
import { useCollection } from '../hooks/useCollection'
import { ContentItems } from '@/components/ui/ContentItems'

export function PricingAdminPage() {
  const { items, status, refresh, mutate } = useCollection(plansService)
  const plans = [...items].sort(byOrder)

  return (
    <AdminPage navId="pricing">
      <U.Notice $tone="warning">
        <TriangleAlert size={16} strokeWidth={2} aria-hidden="true" />
        <span>
          Prices are approved business values. Change them only with approval.
          Each currency is shown exactly as typed; nothing is converted.
        </span>
      </U.Notice>

      {status === 'loading' && <LoadingState label="Loading plans…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' &&
        plans.map((plan, index) => (
          <PlanForm
            key={plan.id}
            plan={plan}
            order={
              <OrderButtons
                label={`${plan.name} plan`}
                index={index}
                count={plans.length}
                onMove={(delta) => mutate(() => plansService.replaceAll(move(plans, index, delta)), 'Plan order updated.')}
              />
            }
            onSave={(fields) =>
              mutate(() => plansService.update(plan.id, fields), `${fields.name} plan saved.`)
            }
          />
        ))}

      <PricingNotes />
    </AdminPage>
  )
}

/** "How pricing works" notes, including maintenance, edited in Website Content. */
function PricingNotes() {
  const { items: pages, status } = useCollection(pagesService)
  const notes = pages.find((page) => page.id === 'pricing')?.sections.find((section) => section.id === 'how-pricing-works')
  if (status !== 'ready' || !notes) return null

  return (
    <U.Panel aria-labelledby="pricing-notes">
      <U.PanelHeader>
        <U.PanelTitle id="pricing-notes">{notes.title}</U.PanelTitle>
        <U.SecondaryButton to="/admin/content">
          <Pencil size={16} strokeWidth={2} aria-hidden="true" />
          Edit in Website Content
        </U.SecondaryButton>
      </U.PanelHeader>
      <U.PanelText>
        Shown on the Pricing page under the plans: estimates, the proposal,
        payment terms, and optional maintenance.
      </U.PanelText>
      <ContentItems items={notes.items} variant="checklist" />
    </U.Panel>
  )
}

type PlanFormProps = {
  plan: PlanRecord
  order: ReactNode
  onSave: (fields: Partial<PlanRecord> & { name: string }) => Promise<boolean>
}

function PlanForm({ plan, order, onSave }: PlanFormProps) {
  const [quoteOnly, setQuoteOnly] = useState(plan.prices.PHP === null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [busy, setBusy] = useState(false)
  const p = `plan-${plan.id}`

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const found: FieldErrors = {}
    if (!text(data, 'name')) found.name = 'Enter a plan name.'
    if (!text(data, 'positioning')) found.positioning = 'Describe who the plan is for.'
    if (!text(data, 'cta')) found.cta = 'Enter a button label.'
    if (!quoteOnly) {
      if (!text(data, 'PHP')) found.PHP = 'Enter the approved PHP starting price.'
      if (!text(data, 'USD')) found.USD = 'Enter the approved USD starting price.'
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setBusy(true)
    await onSave({
      name: text(data, 'name'),
      category: text(data, 'category'),
      prices: quoteOnly
        ? { PHP: null, USD: null }
        : { PHP: text(data, 'PHP'), USD: text(data, 'USD') },
      positioning: text(data, 'positioning'),
      fits: lines(text(data, 'fits')),
      cta: text(data, 'cta'),
      isPublished: data.get('isPublished') === 'on',
    })
    setBusy(false)
  }

  return (
    <U.Panel aria-labelledby={`${p}-title`}>
      <U.PanelHeader>
        <U.PanelTitle id={`${p}-title`}>
          <DataIcon name={plan.icon} size={18} /> {plan.name}
        </U.PanelTitle>
        <U.RowActions>
          <U.Badge $tone={quoteOnly ? 'neutral' : 'info'}>
            {quoteOnly ? 'Custom quotation' : 'Starting price'}
          </U.Badge>
          {order}
        </U.RowActions>
      </U.PanelHeader>

      <F.Form onSubmit={submit} noValidate>
        {Object.keys(errors).length > 0 && (
          <F.ErrorText role="alert">
            <CircleAlert size={14} strokeWidth={2.25} aria-hidden="true" />
            Fix the highlighted fields to save.
          </F.ErrorText>
        )}
        <F.Grid>
          <TextField idPrefix={p} name="name" label="Plan name" defaultValue={plan.name} error={errors.name} />
          <TextField idPrefix={p} name="category" label="Category" defaultValue={plan.category} />
          <F.Field data-wide>
            <F.Switch>
              <input
                type="checkbox"
                checked={quoteOnly}
                onChange={(event) => setQuoteOnly(event.target.checked)}
              />
              Quoted per project (no starting price shown)
            </F.Switch>
          </F.Field>
          <TextField
            idPrefix={p}
            name="PHP"
            label="Starting price (PHP)"
            hint="Include the symbol, e.g. ₱10,000"
            defaultValue={plan.prices.PHP}
            disabled={quoteOnly}
            error={errors.PHP}
          />
          <TextField
            idPrefix={p}
            name="USD"
            label="Starting price (USD)"
            hint="Include the symbol, e.g. $500"
            defaultValue={plan.prices.USD}
            disabled={quoteOnly}
            error={errors.USD}
          />
          <TextField
            idPrefix={p}
            name="positioning"
            label="Who it's for"
            defaultValue={plan.positioning}
            error={errors.positioning}
            wide
          />
          <TextField
            idPrefix={p}
            name="fits"
            label="Good fit for"
            multiline
            hint="One item per line. List only approved inclusions."
            defaultValue={plan.fits.join('\n')}
          />
          <TextField idPrefix={p} name="cta" label="Button label" defaultValue={plan.cta} error={errors.cta} />
          <F.Field data-wide>
            <F.Switch>
              <input type="checkbox" name="isPublished" defaultChecked={plan.isPublished} />
              Show this plan on the website
            </F.Switch>
          </F.Field>
        </F.Grid>
        <F.Actions>
          <U.PrimaryAction type="submit" disabled={busy}>
            <Save size={16} strokeWidth={2} aria-hidden="true" />
            {busy ? 'Saving…' : `Save ${plan.name}`}
          </U.PrimaryAction>
        </F.Actions>
      </F.Form>
    </U.Panel>
  )
}
