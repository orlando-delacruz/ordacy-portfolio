import { Layers } from 'lucide-react'
import { useState } from 'react'
import type { ServiceRecord } from '@/data'
import { servicesService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { FormDialog } from '../components/FormDialog'
import type { FieldErrors } from '../components/FormDialog'
import { DataIcon, EditDeleteButtons, IconSelect, OrderButtons } from '../components/RecordControls'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { byOrder, lines, move, text } from '../format'
import { useCollection } from '../hooks/useCollection'

type Editing = { record: ServiceRecord; trigger: HTMLButtonElement } | null

const validate = (data: FormData): FieldErrors => {
  const errors: FieldErrors = {}
  if (!text(data, 'title')) errors.title = 'Enter a service title.'
  if (!text(data, 'problem')) errors.problem = 'Describe the problem this service addresses.'
  if (lines(text(data, 'capabilities')).length === 0) errors.capabilities = 'List at least one capability.'
  if (text(data, 'description').length < 20) {
    errors.description = 'Write at least 20 characters.'
  }
  return errors
}

export function ServicesAdminPage() {
  const { items, status, refresh, mutate } = useCollection(servicesService)
  const [editing, setEditing] = useState<Editing>(null)
  const services = [...items].sort(byOrder)

  const reorder = (index: number, delta: number) =>
    mutate(
      () => servicesService.replaceAll(move(services, index, delta)),
      'Service order updated.',
    )

  const toggle = (service: ServiceRecord) =>
    mutate(
      () => servicesService.update(service.id, { isPublished: !service.isPublished }),
      service.isPublished ? `${service.title} hidden.` : `${service.title} is visible.`,
    )

  return (
    <AdminPage navId="services">
      {status === 'loading' && <LoadingState label="Loading services…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' && services.length === 0 && (
        <EmptyState icon={Layers} title="No services." text="Services from the data layer appear here." />
      )}
      {status === 'ready' && services.length > 0 && (
        <U.RecordList>
          {services.map((service, index) => {
            return (
              <U.RecordItem key={service.id} $hidden={!service.isPublished}>
                <U.RecordIcon aria-hidden="true">
                  <DataIcon name={service.icon} />
                </U.RecordIcon>
                <U.RecordBody>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  {!service.isPublished && (
                    <U.Badges>
                      <U.Badge $tone="neutral">Hidden</U.Badge>
                    </U.Badges>
                  )}
                </U.RecordBody>
                <U.RowActions>
                  <F.Switch>
                    <input
                      type="checkbox"
                      checked={service.isPublished}
                      onChange={() => toggle(service)}
                      aria-label={`Show ${service.title} on the site`}
                    />
                    <span aria-hidden="true">Visible</span>
                  </F.Switch>
                  <OrderButtons
                    label={service.title}
                    index={index}
                    count={services.length}
                    onMove={(delta) => reorder(index, delta)}
                  />
                  <EditDeleteButtons
                    label={service.title}
                    onEdit={(event) =>
                      setEditing({ record: service, trigger: event.currentTarget })
                    }
                  />
                </U.RowActions>
              </U.RecordItem>
            )
          })}
        </U.RecordList>
      )}

      {editing && (
        <FormDialog
          title={`Edit ${editing.record.title}`}
          validate={validate}
          onClose={() => setEditing(null)}
          returnFocusTo={editing.trigger}
          onSave={(data) =>
            mutate(
              () =>
                servicesService.update(editing.record.id, {
                  title: text(data, 'title'),
                  description: text(data, 'description'),
                  problem: text(data, 'problem'),
                  capabilities: lines(text(data, 'capabilities')),
                  useCases: lines(text(data, 'useCases')),
                  audience: text(data, 'audience'),
                  icon: text(data, 'icon'),
                  isPublished: data.get('isPublished') === 'on',
                }),
              'Service saved.',
            )
          }
        >
          {(errors) => (
            <>
              <TextField idPrefix="service" name="title" label="Title" defaultValue={editing.record.title} error={errors.title} />
              <TextField
                idPrefix="service"
                name="description"
                label="Description"
                multiline
                softLimit={160}
                hint="One or two sentences shown under the title."
                defaultValue={editing.record.description}
                error={errors.description}
              />
              <TextField
                idPrefix="service"
                name="problem"
                label="Problem it solves"
                multiline
                rows={3}
                defaultValue={editing.record.problem}
                error={errors.problem}
              />
              <F.Grid>
                <TextField
                  idPrefix="service"
                  name="capabilities"
                  label="Capabilities"
                  multiline
                  hint="One per line. Only what Ordacy can deliver."
                  defaultValue={editing.record.capabilities.join('\n')}
                  error={errors.capabilities}
                />
                <TextField
                  idPrefix="service"
                  name="useCases"
                  label="Typical use cases"
                  optional
                  multiline
                  hint="One per line."
                  defaultValue={editing.record.useCases.join('\n')}
                />
                <TextField
                  idPrefix="service"
                  name="audience"
                  label="Who it is for"
                  defaultValue={editing.record.audience}
                  wide
                />
              </F.Grid>
              <F.Grid>
                <F.Field>
                  <F.Label htmlFor="service-icon">Icon</F.Label>
                  <IconSelect id="service-icon" name="icon" defaultValue={editing.record.icon} />
                </F.Field>
                <F.Field>
                  <F.Label as="span">Visibility</F.Label>
                  <F.Switch>
                    <input type="checkbox" name="isPublished" defaultChecked={editing.record.isPublished} />
                    Show on the public site
                  </F.Switch>
                </F.Field>
              </F.Grid>
            </>
          )}
        </FormDialog>
      )}
    </AdminPage>
  )
}
