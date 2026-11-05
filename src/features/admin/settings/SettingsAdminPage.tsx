import { Database, HardDrive, KeyRound, Mail, RotateCcw, Save } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import type { SettingsRecord, SiteRecord } from '@/data'
import { restoreOriginalContent, settingsService, siteService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type { FieldErrors } from '../components/FormDialog'
import { ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { isHttpUrl, text } from '../format'
import { useDocument } from '../hooks/useCollection'
import * as S from './styles/settings.styled'

// Each row states what is NOT connected yet. Update when a real integration lands.
const integrations: { icon: LucideIcon; name: string; text: string }[] = [
  { icon: KeyRound, name: 'Authentication', text: 'Sign-in and role-based access are not configured. Until they are, this admin must not hold real client data.' },
  { icon: Database, name: 'Database', text: 'Content and inquiries are kept in this browser. A database connection is not configured.' },
  { icon: Mail, name: 'Email notifications', text: 'New inquiries do not trigger emails. Email delivery is not configured.' },
  { icon: HardDrive, name: 'File storage', text: 'Image uploads are not available. Images are added by URL.' },
]

export function SettingsAdminPage() {
  const siteDoc = useDocument(siteService)
  const settingsDoc = useDocument(settingsService)
  const [resetTrigger, setResetTrigger] = useState<HTMLButtonElement | null>(null)

  return (
    <AdminPage navId="settings">
      {siteDoc.status === 'loading' && <LoadingState />}
      {siteDoc.status === 'error' && <ErrorState onRetry={() => window.location.reload()} />}
      {siteDoc.value && (
        <SiteForm site={siteDoc.value} onSave={(next) => siteDoc.save(next, 'Site details saved.')} />
      )}

      {settingsDoc.value && (
        <PreferencesForm
          settings={settingsDoc.value}
          onSave={(next) => settingsDoc.save(next, 'Preferences saved.')}
        />
      )}

      <U.Panel aria-labelledby="settings-integrations">
        <U.PanelHeader>
          <U.PanelTitle id="settings-integrations">Integrations and security</U.PanelTitle>
        </U.PanelHeader>
        <S.StatusList>
          {integrations.map(({ icon: Icon, name, text: description }) => (
            <li key={name}>
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              <div>
                <strong>
                  {name} <U.Badge $tone="neutral">Not configured</U.Badge>
                </strong>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </S.StatusList>
      </U.Panel>

      <U.Panel aria-labelledby="settings-storage">
        <U.PanelHeader>
          <U.PanelTitle id="settings-storage">Storage</U.PanelTitle>
        </U.PanelHeader>
        <U.PanelText>
          Changes made in this admin are saved in this browser and appear on
          the public website in this browser after a page reload. They are not
          sent to a server, so other visitors and devices do not see them.
          Restoring returns every record to its original content.
        </U.PanelText>
        <div>
          <U.SecondaryAction
            type="button"
            aria-haspopup="dialog"
            onClick={(event: MouseEvent<HTMLButtonElement>) => setResetTrigger(event.currentTarget)}
          >
            <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
            Restore original content
          </U.SecondaryAction>
        </div>
      </U.Panel>

      {resetTrigger && (
        <ConfirmDialog
          title="Restore original content?"
          message="Every change saved in this browser, including inquiries sent from the contact form here, will be discarded. The page reloads afterwards."
          confirmLabel="Restore content"
          onConfirm={async () => {
            restoreOriginalContent()
            return true
          }}
          onClose={() => setResetTrigger(null)}
          returnFocusTo={resetTrigger}
        />
      )}
    </AdminPage>
  )
}

function SiteForm({ site, onSave }: { site: SiteRecord; onSave: (next: SiteRecord) => Promise<boolean> }) {
  const [errors, setErrors] = useState<FieldErrors>({})

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const found: FieldErrors = {}
    if (!text(data, 'name')) found.name = 'Enter the business name.'
    if (!isHttpUrl(text(data, 'siteUrl'))) found.siteUrl = 'Enter the full site address (https://…).'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    void onSave({
      ...site,
      name: text(data, 'name'),
      tagline: text(data, 'tagline'),
      description: text(data, 'description'),
      siteUrl: text(data, 'siteUrl'),
      siteUrlPending: data.get('siteUrlConfirmed') !== 'on',
    })
  }

  return (
    <U.Panel aria-labelledby="settings-site">
      <U.PanelHeader>
        <U.PanelTitle id="settings-site">Site details</U.PanelTitle>
      </U.PanelHeader>
      <F.Form onSubmit={submit} noValidate>
        <F.Grid>
          <TextField idPrefix="site" name="name" label="Business name" defaultValue={site.name} error={errors.name} />
          <TextField idPrefix="site" name="tagline" label="Tagline" defaultValue={site.tagline} />
          <TextField idPrefix="site" name="description" label="Description" multiline rows={3} defaultValue={site.description} wide />
          <TextField
            idPrefix="site"
            name="siteUrl"
            label="Site URL"
            type="url"
            hint="Used for canonical URLs and the sitemap."
            defaultValue={site.siteUrl}
            error={errors.siteUrl}
          />
          <F.Field>
            <F.Label as="span">Domain status</F.Label>
            <F.Switch>
              <input type="checkbox" name="siteUrlConfirmed" defaultChecked={!site.siteUrlPending} />
              This domain is confirmed
            </F.Switch>
          </F.Field>
        </F.Grid>
        <F.Actions>
          <U.PrimaryAction type="submit">
            <Save size={16} strokeWidth={2} aria-hidden="true" />
            Save site details
          </U.PrimaryAction>
        </F.Actions>
      </F.Form>
    </U.Panel>
  )
}

function PreferencesForm({
  settings,
  onSave,
}: {
  settings: SettingsRecord
  onSave: (next: SettingsRecord) => Promise<boolean>
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    void onSave({ ...settings, inquiriesPageSize: Number(text(data, 'inquiriesPageSize')) || 10 })
  }

  return (
    <U.Panel aria-labelledby="settings-prefs">
      <U.PanelHeader>
        <U.PanelTitle id="settings-prefs">Admin preferences</U.PanelTitle>
      </U.PanelHeader>
      <F.Form onSubmit={submit}>
        <F.Field>
          <F.Label htmlFor="prefs-page-size">Inquiries per page</F.Label>
          <F.Select id="prefs-page-size" name="inquiriesPageSize" defaultValue={String(settings.inquiriesPageSize)}>
            {[10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </F.Select>
        </F.Field>
        <F.Actions>
          <U.PrimaryAction type="submit">
            <Save size={16} strokeWidth={2} aria-hidden="true" />
            Save preferences
          </U.PrimaryAction>
        </F.Actions>
      </F.Form>
    </U.Panel>
  )
}
