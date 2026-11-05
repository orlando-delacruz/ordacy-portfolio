import { Braces, Info, Search } from 'lucide-react'
import { useState } from 'react'
import { site } from '@/data'
import type { SeoRecord } from '@/data'
import { seoService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { FormDialog } from '../components/FormDialog'
import type { FieldErrors } from '../components/FormDialog'
import { EditDeleteButtons } from '../components/RecordControls'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { isHttpUrl, text } from '../format'
import { useCollection } from '../hooks/useCollection'
import { organizationJsonLd } from '@/hooks/usePageMeta'

type Editing = { record: SeoRecord; trigger: HTMLButtonElement } | null

const autoCanonical = (path: string) =>
  path === '*' ? 'None (not indexed)' : new URL(path, site.siteUrl).toString()

const validate = (data: FormData): FieldErrors => {
  const errors: FieldErrors = {}
  if (!text(data, 'title')) errors.title = 'Enter a page title.'
  if (!text(data, 'description')) errors.description = 'Enter a meta description.'
  for (const key of ['canonical', 'ogImage']) {
    const value = text(data, key)
    if (value && !isHttpUrl(value)) errors[key] = 'Enter a full URL (https://…) or leave it empty.'
  }
  return errors
}

const orNull = (data: FormData, key: string) => text(data, key) || null

export function SeoAdminPage() {
  const { items, status, refresh, mutate } = useCollection(seoService)
  const [editing, setEditing] = useState<Editing>(null)

  return (
    <AdminPage navId="seo">
      <U.Notice>
        <Info size={16} strokeWidth={2} aria-hidden="true" />
        <span>
          Canonical URLs default to {site.siteUrl} plus the page path
          {site.siteUrlPending ? ' (domain to be confirmed in Settings)' : ''}.
          Set a canonical URL below only to override that default.
        </span>
      </U.Notice>

      {status === 'loading' && <LoadingState label="Loading SEO settings…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' && items.length === 0 && (
        <EmptyState icon={Search} title="No pages." text="Public pages appear here once they exist in the data layer." />
      )}
      {status === 'ready' && items.length > 0 && (
        <U.TableWrap>
          <U.Table>
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col">SEO title</th>
                <th scope="col">Description</th>
                <th scope="col">Indexing</th>
                <th scope="col">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((page) => (
                <tr key={page.id}>
                  <td>
                    <U.CellStrong>
                      <strong>{page.path === '*' ? 'Not found (404)' : page.path}</strong>
                      <span>{page.id}</span>
                    </U.CellStrong>
                  </td>
                  <td data-label="Title">{page.title}</td>
                  <td data-label="Description">
                    <U.Muted>{page.description}</U.Muted>
                  </td>
                  <td data-label="Indexing">
                    <U.Badge $tone={page.noindex ? 'neutral' : 'success'}>
                      {page.noindex ? 'noindex' : 'Indexed'}
                    </U.Badge>
                  </td>
                  <td>
                    <U.RowActions>
                      <EditDeleteButtons
                        label={`SEO for ${page.path}`}
                        onEdit={(event) => setEditing({ record: page, trigger: event.currentTarget })}
                      />
                    </U.RowActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </U.Table>
        </U.TableWrap>
      )}

      <U.Panel aria-labelledby="seo-structured-data">
        <U.PanelHeader>
          <U.PanelTitle id="seo-structured-data">
            <Braces size={16} strokeWidth={2} aria-hidden="true" /> Structured data
          </U.PanelTitle>
          <U.Badge $tone="info">Homepage</U.Badge>
        </U.PanelHeader>
        <U.PanelText>
          Organization data added to the homepage for search engines. It is
          generated from Site details and the published services, and includes
          the site URL and email only once they are confirmed.
        </U.PanelText>
        <U.Code>{JSON.stringify(organizationJsonLd(), null, 2)}</U.Code>
      </U.Panel>

      {editing && (
        <FormDialog
          title={`SEO for ${editing.record.path === '*' ? 'the 404 page' : editing.record.path}`}
          validate={validate}
          onClose={() => setEditing(null)}
          returnFocusTo={editing.trigger}
          onSave={(data) =>
            mutate(
              () =>
                seoService.update(editing.record.id, {
                  title: text(data, 'title'),
                  description: text(data, 'description'),
                  canonical: orNull(data, 'canonical'),
                  ogTitle: orNull(data, 'ogTitle'),
                  ogDescription: orNull(data, 'ogDescription'),
                  ogImage: orNull(data, 'ogImage'),
                  noindex: data.get('noindex') === 'on',
                }),
              'SEO settings saved.',
            )
          }
        >
          {(errors) => {
            const r = editing.record
            return (
              <>
                <F.Fieldset>
                  <legend>Search results</legend>
                  <TextField idPrefix="seo" name="title" label="SEO title" softLimit={60} defaultValue={r.title} error={errors.title} />
                  <TextField
                    idPrefix="seo"
                    name="description"
                    label="Meta description"
                    multiline
                    rows={3}
                    softLimit={160}
                    defaultValue={r.description}
                    error={errors.description}
                  />
                  <TextField
                    idPrefix="seo"
                    name="canonical"
                    label="Canonical URL"
                    type="url"
                    optional
                    hint={`Default: ${autoCanonical(r.path)}`}
                    defaultValue={r.canonical}
                    error={errors.canonical}
                  />
                  <F.Switch>
                    <input type="checkbox" name="noindex" defaultChecked={!!r.noindex} />
                    Hide from search engines (noindex)
                  </F.Switch>
                </F.Fieldset>
                <F.Fieldset>
                  <legend>Social sharing (Open Graph)</legend>
                  <TextField idPrefix="seo" name="ogTitle" label="Open Graph title" optional hint="Defaults to the SEO title." defaultValue={r.ogTitle} />
                  <TextField
                    idPrefix="seo"
                    name="ogDescription"
                    label="Open Graph description"
                    optional
                    multiline
                    rows={2}
                    hint="Defaults to the meta description."
                    defaultValue={r.ogDescription}
                  />
                  <TextField
                    idPrefix="seo"
                    name="ogImage"
                    label="Open Graph image URL"
                    type="url"
                    optional
                    hint="1200 × 630 px recommended. None is set yet."
                    defaultValue={r.ogImage}
                    error={errors.ogImage}
                  />
                </F.Fieldset>
              </>
            )
          }}
        </FormDialog>
      )}
    </AdminPage>
  )
}
