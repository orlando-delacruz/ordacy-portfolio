import { CircleHelp, Plus } from 'lucide-react'
import { useState } from 'react'
import type { FaqRecord } from '@/data'
import { createId, faqsService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FormDialog } from '../components/FormDialog'
import type { FieldErrors } from '../components/FormDialog'
import { DataIcon, EditDeleteButtons, IconSelect, OrderButtons } from '../components/RecordControls'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { byOrder, move, renumber, text } from '../format'
import { useCollection } from '../hooks/useCollection'

type Dialog =
  | { kind: 'edit'; record: FaqRecord | null; trigger: HTMLButtonElement }
  | { kind: 'delete'; record: FaqRecord; trigger: HTMLButtonElement }
  | null

const validate = (data: FormData): FieldErrors => {
  const errors: FieldErrors = {}
  if (!text(data, 'category')) errors.category = 'Choose or type a category.'
  if (text(data, 'question').length < 5) errors.question = 'Enter the question.'
  if (text(data, 'answer').length < 10) errors.answer = 'Write an answer (at least 10 characters).'
  return errors
}

export function FaqsAdminPage() {
  const { items, status, refresh, mutate } = useCollection(faqsService)
  const [dialog, setDialog] = useState<Dialog>(null)
  const faqs = [...items].sort(byOrder)
  const categories = [...new Set(faqs.map((faq) => faq.category))]
  const featuredCount = faqs.filter((faq) => faq.featured && faq.isPublished).length

  const save = (record: FaqRecord | null, data: FormData) => {
    const fields = {
      question: text(data, 'question'),
      category: text(data, 'category') || 'General',
      answer: text(data, 'answer'),
      icon: text(data, 'icon'),
      featured: data.get('featured') === 'on',
      pricingPage: data.get('pricingPage') === 'on',
      isPublished: data.get('isPublished') === 'on',
    }
    return record
      ? mutate(() => faqsService.update(record.id, fields), 'FAQ saved.')
      : mutate(
          () =>
            faqsService.create({
              id: createId('faq'),
              ...fields,
              displayOrder: faqs.length + 1,
            }),
          'FAQ added.',
        )
  }

  return (
    <AdminPage
      navId="faqs"
      actions={
        <U.PrimaryAction
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => setDialog({ kind: 'edit', record: null, trigger: event.currentTarget })}
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Add FAQ
        </U.PrimaryAction>
      }
    >
      {featuredCount > 5 && (
        <U.Notice $tone="warning">
          <CircleHelp size={16} strokeWidth={2} aria-hidden="true" />
          <span>
            {featuredCount} FAQs are marked for the homepage. The homepage
            section is designed for five.
          </span>
        </U.Notice>
      )}

      {status === 'loading' && <LoadingState label="Loading FAQs…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' && faqs.length === 0 && (
        <EmptyState icon={CircleHelp} title="No FAQs yet." text="Add the first question visitors ask before they get in touch." />
      )}
      {status === 'ready' && faqs.length > 0 && (
        <U.RecordList>
          {faqs.map((faq, index) => {
            return (
              <U.RecordItem key={faq.id} $hidden={!faq.isPublished}>
                <U.RecordIcon aria-hidden="true">
                  <DataIcon name={faq.icon} />
                </U.RecordIcon>
                <U.RecordBody>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                  <U.Badges>
                    {!faq.isPublished && <U.Badge $tone="neutral">Hidden</U.Badge>}
                    {faq.featured && <U.Badge $tone="info">Homepage</U.Badge>}
                    {faq.pricingPage && <U.Badge $tone="info">Pricing page</U.Badge>}
                    <U.Badge $tone="neutral">{faq.category}</U.Badge>
                  </U.Badges>
                </U.RecordBody>
                <U.RowActions>
                  <F.Switch>
                    <input
                      type="checkbox"
                      checked={faq.isPublished}
                      aria-label={`Publish "${faq.question}"`}
                      onChange={() =>
                        mutate(
                          () => faqsService.update(faq.id, { isPublished: !faq.isPublished }),
                          faq.isPublished ? 'FAQ hidden.' : 'FAQ published.',
                        )
                      }
                    />
                    <span aria-hidden="true">Published</span>
                  </F.Switch>
                  <OrderButtons
                    label="this FAQ"
                    index={index}
                    count={faqs.length}
                    onMove={(delta) =>
                      mutate(() => faqsService.replaceAll(move(faqs, index, delta)), 'FAQ order updated.')
                    }
                  />
                  <EditDeleteButtons
                    label={`"${faq.question}"`}
                    onEdit={(event) => setDialog({ kind: 'edit', record: faq, trigger: event.currentTarget })}
                    onDelete={(event) => setDialog({ kind: 'delete', record: faq, trigger: event.currentTarget })}
                  />
                </U.RowActions>
              </U.RecordItem>
            )
          })}
        </U.RecordList>
      )}

      {dialog?.kind === 'edit' && (
        <FormDialog
          title={dialog.record ? 'Edit FAQ' : 'Add FAQ'}
          submitLabel={dialog.record ? 'Save changes' : 'Add FAQ'}
          validate={validate}
          onSave={(data) => save(dialog.record, data)}
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        >
          {(errors) => (
            <>
              <TextField idPrefix="faq" name="question" label="Question" defaultValue={dialog.record?.question} error={errors.question} />
              <TextField
                idPrefix="faq"
                name="answer"
                label="Answer"
                multiline
                rows={5}
                defaultValue={dialog.record?.answer}
                error={errors.answer}
              />
              <F.Grid>
                <F.Field>
                  <TextField
                    idPrefix="faq"
                    name="category"
                    label="Category"
                    hint="Groups the question in the full FAQ list."
                    defaultValue={dialog.record?.category}
                    error={errors.category}
                    list="faq-categories"
                  />
                  <datalist id="faq-categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </F.Field>
                <F.Field>
                  <F.Label htmlFor="faq-icon">Icon</F.Label>
                  <IconSelect id="faq-icon" name="icon" defaultValue={dialog.record?.icon ?? 'CircleHelp'} />
                </F.Field>
                <F.Fieldset>
                  <legend>Where it appears</legend>
                  <F.Switch>
                    <input type="checkbox" name="isPublished" defaultChecked={dialog.record?.isPublished ?? true} />
                    Published
                  </F.Switch>
                  <F.Switch>
                    <input type="checkbox" name="featured" defaultChecked={dialog.record?.featured ?? false} />
                    Homepage FAQ section
                  </F.Switch>
                  <F.Switch>
                    <input type="checkbox" name="pricingPage" defaultChecked={dialog.record?.pricingPage ?? false} />
                    Pricing page FAQ
                  </F.Switch>
                </F.Fieldset>
              </F.Grid>
            </>
          )}
        </FormDialog>
      )}

      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title="Delete this FAQ?"
          message={`"${dialog.record.question}" will be permanently removed.`}
          onConfirm={() =>
            mutate(
              () =>
                faqsService.replaceAll(
                  renumber(faqs.filter((faq) => faq.id !== dialog.record.id)),
                ),
              'FAQ deleted.',
            )
          }
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        />
      )}
    </AdminPage>
  )
}
