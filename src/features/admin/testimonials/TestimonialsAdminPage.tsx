import { Info, Plus, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import type { TestimonialRecord, TestimonialStatus } from '@/data'
import { createId, testimonialsService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FormDialog } from '../components/FormDialog'
import type { FieldErrors } from '../components/FormDialog'
import { EditDeleteButtons, OrderButtons } from '../components/RecordControls'
import { ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { byOrder, formatDate, move, text } from '../format'
import { useCollection } from '../hooks/useCollection'

type Dialog =
  | { kind: 'edit'; record: TestimonialRecord | null; trigger: HTMLButtonElement }
  | { kind: 'delete'; record: TestimonialRecord; trigger: HTMLButtonElement }
  | null

const statusMeta: Record<TestimonialStatus, { label: string; tone: U.Tone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

const validate = (data: FormData): FieldErrors => {
  const errors: FieldErrors = {}
  if (!text(data, 'name')) errors.name = "Enter the client's name."
  if (!text(data, 'role')) errors.role = 'Enter their role.'
  if (!text(data, 'company')) errors.company = 'Enter the company.'
  if (text(data, 'quote').length < 20) errors.quote = "Paste the client's words (at least 20 characters)."
  return errors
}

export function TestimonialsAdminPage() {
  const { items, status, refresh, mutate } = useCollection(testimonialsService)
  const [dialog, setDialog] = useState<Dialog>(null)
  const testimonials = [...items].sort(byOrder)
  const published = testimonials.filter((t) => !t.isSample && t.status === 'approved' && t.isPublished).length
  const samples = testimonials.filter((t) => t.isSample).length

  const save = (record: TestimonialRecord | null, data: FormData) => {
    const name = text(data, 'name')
    const fields = {
      name,
      role: text(data, 'role'),
      company: text(data, 'company'),
      quote: text(data, 'quote'),
      rating: record?.isSample ? null : Number(text(data, 'rating')) || null,
      initials: initialsOf(name),
      // Placeholder copy can never be approved.
      status: record?.isSample ? 'pending' : (text(data, 'status') as TestimonialStatus),
      isPublished:
        !record?.isSample && text(data, 'status') === 'approved' && data.get('isPublished') === 'on',
    }
    return record
      ? mutate(() => testimonialsService.update(record.id, fields), 'Testimonial saved.')
      : mutate(
          () =>
            testimonialsService.create({
              id: createId('testimonial'),
              ...fields,
              isSample: false,
              displayOrder: testimonials.length + 1,
              createdAt: new Date().toISOString(),
            }),
          'Testimonial added.',
        )
  }

  return (
    <AdminPage
      navId="testimonials"
      actions={
        <U.PrimaryAction
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => setDialog({ kind: 'edit', record: null, trigger: event.currentTarget })}
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Add testimonial
        </U.PrimaryAction>
      }
    >
      <U.Notice>
        <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
        <span>
          Only add real feedback a client has agreed to share. Approved and
          published testimonials appear on the site ({published} right now). Sample records
          ({samples}) are never published.
        </span>
      </U.Notice>

      {status === 'loading' && <LoadingState label="Loading testimonials…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}

      {status === 'ready' && testimonials.length > 0 && (
        <U.TableWrap>
          <U.Table>
            <thead>
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Quote</th>
                <th scope="col">Status</th>
                <th scope="col">Added</th>
                <th scope="col">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial, index) => {
                const meta = statusMeta[testimonial.status]
                return (
                  <tr key={testimonial.id}>
                    <td>
                      <U.CellStrong>
                        <strong>{testimonial.name}</strong>
                        <span>
                          {testimonial.role}, {testimonial.company}
                        </span>
                      </U.CellStrong>
                    </td>
                    <td data-label="Quote">
                      <U.Muted>{testimonial.quote.slice(0, 90)}{testimonial.quote.length > 90 ? '…' : ''}</U.Muted>
                    </td>
                    <td data-label="Status">
                      <U.Badges>
                        <U.Badge $tone={meta.tone}>{meta.label}</U.Badge>
                        {testimonial.isSample && <U.Badge $tone="neutral">Sample</U.Badge>}
                        {testimonial.isPublished && <U.Badge $tone="info">Published</U.Badge>}
                      </U.Badges>
                    </td>
                    <td data-label="Added">{formatDate(testimonial.createdAt)}</td>
                    <td>
                      <U.RowActions>
                        <OrderButtons
                          label={`testimonial from ${testimonial.name}`}
                          index={index}
                          count={testimonials.length}
                          onMove={(delta) =>
                            mutate(() => testimonialsService.replaceAll(move(testimonials, index, delta)), 'Testimonial order updated.')
                          }
                        />
                        <EditDeleteButtons
                          label={`testimonial from ${testimonial.name}`}
                          onEdit={(event) => setDialog({ kind: 'edit', record: testimonial, trigger: event.currentTarget })}
                          onDelete={(event) => setDialog({ kind: 'delete', record: testimonial, trigger: event.currentTarget })}
                        />
                      </U.RowActions>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </U.Table>
        </U.TableWrap>
      )}

      {dialog?.kind === 'edit' && (
        <FormDialog
          title={dialog.record ? 'Edit testimonial' : 'Add testimonial'}
          submitLabel={dialog.record ? 'Save changes' : 'Add testimonial'}
          validate={validate}
          onSave={(data) => save(dialog.record, data)}
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        >
          {(errors) => (
            <>
              {dialog.record?.isSample && (
                <U.Notice>
                  <Info size={16} strokeWidth={2} aria-hidden="true" />
                  <span>
                    Sample record, not a client endorsement. It stays pending
                    and is never published.
                  </span>
                </U.Notice>
              )}
              <F.Grid>
                <TextField idPrefix="testimonial" name="name" label="Client name" defaultValue={dialog.record?.name} error={errors.name} />
                <TextField idPrefix="testimonial" name="role" label="Role" defaultValue={dialog.record?.role} error={errors.role} />
                <TextField idPrefix="testimonial" name="company" label="Company" defaultValue={dialog.record?.company} error={errors.company} wide />
                <TextField
                  idPrefix="testimonial"
                  name="quote"
                  label="Quote"
                  multiline
                  rows={5}
                  softLimit={320}
                  hint="The client's own words, unedited apart from typos."
                  defaultValue={dialog.record?.quote}
                  error={errors.quote}
                  wide
                />
                <F.Field>
                  <F.Label htmlFor="testimonial-rating">Rating</F.Label>
                  <F.Select
                    id="testimonial-rating"
                    name="rating"
                    defaultValue={String(dialog.record?.rating ?? '')}
                    disabled={dialog.record?.isSample}
                  >
                    <option value="">No rating</option>
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} of 5
                      </option>
                    ))}
                  </F.Select>
                </F.Field>
                <F.Field>
                  <F.Label htmlFor="testimonial-status">Status</F.Label>
                  <F.Select
                    id="testimonial-status"
                    name="status"
                    defaultValue={dialog.record?.status ?? 'pending'}
                    disabled={dialog.record?.isSample}
                  >
                    <option value="pending">Pending review</option>
                    <option value="approved">Approved by the client</option>
                  </F.Select>
                </F.Field>
                <F.Field data-wide>
                  <F.Switch>
                    <input
                      type="checkbox"
                      name="isPublished"
                      defaultChecked={dialog.record?.isPublished ?? false}
                      disabled={dialog.record?.isSample}
                    />
                    Publish on the website (approved testimonials only)
                  </F.Switch>
                </F.Field>
              </F.Grid>
            </>
          )}
        </FormDialog>
      )}

      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title="Delete this testimonial?"
          message={`The testimonial from ${dialog.record.name} will be permanently removed.`}
          onConfirm={() => mutate(() => testimonialsService.remove(dialog.record.id), 'Testimonial deleted.')}
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        />
      )}
    </AdminPage>
  )
}
