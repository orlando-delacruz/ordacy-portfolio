import { ExternalLink, FileText, PanelBottom, Save } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ContentItem, PageRecord, PageSectionRecord, SiteRecord } from '@/data'
import { pagesService, siteService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { Tabs } from '../components/Tabs'
import { TextField } from '../components/TextField'
import { lines, text } from '../format'
import { useCollection, useDocument } from '../hooks/useCollection'
import { adminNavGroups } from '../navigation'

const FOOTER_TAB = 'footer'

// Collections with their own managers, linked from here instead of duplicated.
const managers = adminNavGroups
  .flatMap((group) => group.items)
  .filter((item) => ['projects', 'testimonials', 'services', 'pricing', 'faqs', 'gallery'].includes(item.id))

/** "Title | text" per line. */
const parseItems = (value: string): ContentItem[] =>
  lines(value).map((line) => {
    const [title = '', ...rest] = line.split('|')
    return { title: title.trim(), text: rest.join('|').trim() }
  })

export function ContentAdminPage() {
  const { items: pages, status, refresh, mutate } = useCollection(pagesService)
  const siteDoc = useDocument(siteService)
  const [active, setActive] = useState('home')

  const page = pages.find((entry) => entry.id === active)
  const tabs = [
    ...pages.map((entry) => ({ id: entry.id, label: entry.label, icon: FileText })),
    { id: FOOTER_TAB, label: 'Footer and contact', icon: PanelBottom },
  ]

  const savePage = (next: PageRecord, message: string) =>
    mutate(() => pagesService.update(next.id, next), message)

  return (
    <AdminPage navId="content">
      <U.Panel aria-labelledby="content-managers">
        <U.PanelHeader>
          <U.PanelTitle id="content-managers">Managed separately</U.PanelTitle>
        </U.PanelHeader>
        <U.PanelText>
          Page headings and introductions are edited below. Lists of records
          have their own screens:
        </U.PanelText>
        <U.Toolbar>
          {managers.map(({ id, label, path, Icon }) => (
            <U.SecondaryButton key={id} to={path}>
              <Icon size={16} strokeWidth={2} aria-hidden="true" />
              {label}
            </U.SecondaryButton>
          ))}
        </U.Toolbar>
      </U.Panel>

      {status === 'loading' && <LoadingState label="Loading page content…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' && (
        <Tabs label="Public pages" tabs={tabs} active={active} onChange={setActive}>
          {page && <PageEditor key={page.id} page={page} onSave={savePage} />}
          {active === FOOTER_TAB && siteDoc.value && (
            <FooterEditor site={siteDoc.value} onSave={(next) => siteDoc.save(next, 'Footer and contact saved.')} />
          )}
        </Tabs>
      )}
    </AdminPage>
  )
}

type PageEditorProps = {
  page: PageRecord
  onSave: (next: PageRecord, message: string) => Promise<boolean>
}

function PageEditor({ page, onSave }: PageEditorProps) {
  return (
    <F.Form as="div">
      <U.Toolbar>
        <U.Count>
          Public page: {page.path}
        </U.Count>
        <U.ToolbarSpacer />
        {/* Full page load so the public page shows the latest saved edits. */}
        <U.SecondaryButton as="a" href={page.path === '/404' ? '/page-not-found' : page.path} to="">
          <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
          View page
        </U.SecondaryButton>
      </U.Toolbar>

      {page.header && (
        <BlockForm
          id={`${page.id}-header`}
          title="Page header"
          fields={{ eyebrow: page.header.eyebrow, title: page.header.title, description: page.header.description }}
          onSave={(values) =>
            onSave(
              {
                ...page,
                header: {
                  eyebrow: values.eyebrow ?? '',
                  title: values.title ?? '',
                  description: values.description ?? '',
                },
              },
              'Page header saved.',
            )
          }
        />
      )}

      {page.sections.map((section) => (
        <BlockForm
          key={section.id}
          id={`${page.id}-${section.id}`}
          title={section.label}
          fields={{ eyebrow: section.eyebrow, title: section.title, description: section.description }}
          items={section.items}
          onSave={(values, items) => {
            const next: PageSectionRecord = {
              ...section,
              eyebrow: section.eyebrow === null ? null : (values.eyebrow ?? ''),
              title: values.title ?? section.title,
              description: section.description === null ? null : (values.description ?? ''),
              items: section.items === null ? null : items,
            }
            return onSave(
              { ...page, sections: page.sections.map((s) => (s.id === section.id ? next : s)) },
              `${section.label} saved.`,
            )
          }}
        />
      ))}
    </F.Form>
  )
}

type BlockFields = { eyebrow: string | null; title: string; description: string | null }

type BlockFormProps = {
  id: string
  title: string
  fields: BlockFields
  items?: readonly ContentItem[] | null
  onSave: (values: Partial<Record<keyof BlockFields, string>>, items: ContentItem[]) => Promise<boolean>
}

/** One heading block (eyebrow, title, description, optional list). */
function BlockForm({ id, title, fields, items, onSave }: BlockFormProps) {
  const [error, setError] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (!text(data, 'title')) {
      setError('Enter a heading.')
      return
    }
    setError(undefined)
    setBusy(true)
    await onSave(
      {
        eyebrow: text(data, 'eyebrow'),
        title: text(data, 'title'),
        description: text(data, 'description'),
      },
      parseItems(text(data, 'items')),
    )
    setBusy(false)
  }

  return (
    <U.Panel aria-labelledby={`${id}-heading`}>
      <U.PanelHeader>
        <U.PanelTitle id={`${id}-heading`}>{title}</U.PanelTitle>
      </U.PanelHeader>
      <F.Form onSubmit={submit} noValidate>
        <F.Grid>
          {fields.eyebrow !== null && (
            <TextField idPrefix={id} name="eyebrow" label="Eyebrow" defaultValue={fields.eyebrow} />
          )}
          <TextField idPrefix={id} name="title" label="Heading" defaultValue={fields.title} error={error} wide={fields.eyebrow === null} />
          {fields.description !== null && (
            <TextField
              idPrefix={id}
              name="description"
              label="Description"
              multiline
              rows={2}
              defaultValue={fields.description}
              wide
            />
          )}
          {items && (
            <TextField
              idPrefix={id}
              name="items"
              label="List items"
              multiline
              hint="One per line: Title | Text"
              defaultValue={items.map((item) => `${item.title} | ${item.text}`).join('\n')}
              wide
            />
          )}
        </F.Grid>
        <F.Actions>
          <U.PrimaryAction type="submit" disabled={busy}>
            <Save size={16} strokeWidth={2} aria-hidden="true" />
            {busy ? 'Saving…' : 'Save'}
          </U.PrimaryAction>
        </F.Actions>
      </F.Form>
    </U.Panel>
  )
}

function FooterEditor({ site, onSave }: { site: SiteRecord; onSave: (next: SiteRecord) => Promise<boolean> }) {
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // Empty values stay pending, so the public site keeps hiding them.
    const contactValue = (key: string) => {
      const value = text(data, key) || null
      return { value, pending: value === null }
    }
    setBusy(true)
    await onSave({
      ...site,
      footerTagline: text(data, 'footerTagline') || site.footerTagline,
      contact: {
        email: contactValue('email'),
        phone: contactValue('phone'),
        location: contactValue('location'),
        responseTime: contactValue('responseTime'),
      },
    })
    setBusy(false)
  }

  const c = site.contact
  return (
    <U.Panel aria-labelledby="footer-title">
      <U.PanelHeader>
        <U.PanelTitle id="footer-title">Footer and contact information</U.PanelTitle>
      </U.PanelHeader>
      <U.PanelText>
        Leave a contact field empty until the detail is confirmed. Empty fields
        are never shown on the site.
      </U.PanelText>
      <F.Form onSubmit={submit} noValidate>
        <F.Grid>
          <TextField idPrefix="footer" name="footerTagline" label="Footer tagline" multiline rows={2} defaultValue={site.footerTagline} wide />
          <TextField idPrefix="footer" name="email" label="Public email" type="email" placeholder="hello@yourdomain.com" badge={c.email.value ? undefined : 'Not set'} defaultValue={c.email.value} />
          <TextField idPrefix="footer" name="phone" label="Public phone" placeholder="+63 900 000 0000" badge={c.phone.value ? undefined : 'Not set'} defaultValue={c.phone.value} />
          <TextField idPrefix="footer" name="location" label="Location" placeholder="City, Country" badge={c.location.value ? undefined : 'Not set'} defaultValue={c.location.value} />
          <TextField
            idPrefix="footer"
            name="responseTime"
            label="Response time"
            optional
            hint="Only a commitment you can keep."
            defaultValue={c.responseTime.value}
          />
        </F.Grid>
        <F.Actions>
          <U.PrimaryAction type="submit" disabled={busy}>
            <Save size={16} strokeWidth={2} aria-hidden="true" />
            {busy ? 'Saving…' : 'Save footer and contact'}
          </U.PrimaryAction>
        </F.Actions>
      </F.Form>
    </U.Panel>
  )
}
