import { Database, HardDrive, KeyRound, Mail, Save } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SettingsRecord, SiteRecord } from '@/data'
import { settingsService, siteService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import type { FieldErrors } from '../components/FormDialog'
import { ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { isHttpsUrl, text } from '../format'
import { useDocument } from '../hooks/useCollection'
import * as S from './styles/settings.styled'

// Status is a read-only fact here. Update a row when its integration lands.
const integrations: {
  icon: LucideIcon
  name: string
  status: string
  connected: boolean
  text: string
}[] = [
  {
    icon: KeyRound,
    name: 'Authentication',
    status: 'Connected (Supabase Auth with TOTP)',
    connected: true,
    text: 'Password and authenticator-code sign-in protect the admin. Every request verifies the session and requires two-factor authentication.',
  },
  {
    icon: Database,
    name: 'Database',
    status: 'Connected (Supabase)',
    connected: true,
    text: 'Content is stored in Supabase Postgres. Edits save through the authenticated API and appear on the public site after its cache refreshes.',
  },
  {
    icon: Mail,
    name: 'Email notifications',
    status: 'Connected (EmailJS)',
    connected: true,
    text: 'Inquiries are saved to the database first, then emailed through EmailJS. Sends are verified server-side; a failed notification never loses the inquiry.',
  },
  {
    icon: HardDrive,
    name: 'File storage',
    status: 'Not configured',
    connected: false,
    text: 'Image uploads are not available. Images are added by URL.',
  },
]

export function SettingsAdminPage() {
  const siteDoc = useDocument(siteService)
  const settingsDoc = useDocument(settingsService)

  return (
    <AdminPage navId="settings">
      {siteDoc.status === 'loading' && <LoadingState />}
      {siteDoc.status === 'error' && <ErrorState onRetry={() => window.location.reload()} />}
      {siteDoc.value && (
        <>
          <SiteForm site={siteDoc.value} onSave={(next) => siteDoc.save(next, 'Site details saved.')} />
          <ProfileStatsForm site={siteDoc.value} onSave={(next) => siteDoc.save(next, 'Profile stats saved.')} />
        </>
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
          {integrations.map(({ icon: Icon, name, status, connected, text }) => (
            <li key={name}>
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              <div>
                <strong>
                  {name}{' '}
                  <U.Badge $tone={connected ? 'success' : 'neutral'}>
                    {status}
                  </U.Badge>
                </strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </S.StatusList>
      </U.Panel>
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
    if (!isHttpsUrl(text(data, 'siteUrl'))) found.siteUrl = 'Enter the full site address (https://…).'
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

function ProfileStatsForm({ site, onSave }: { site: SiteRecord; onSave: (next: SiteRecord) => Promise<boolean> }) {
  const [busy, setBusy] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setBusy(true)
    void onSave({
      ...site,
      profileStats: {
        views: text(data, 'profileViews').trim(),
        projects: text(data, 'profileProjects').trim(),
        likes: text(data, 'profileLikes').trim(),
      },
    }).finally(() => setBusy(false))
  }

  return (
    <U.Panel aria-labelledby="settings-profile-stats">
      <U.PanelHeader>
        <U.PanelTitle id="settings-profile-stats">Profile stats</U.PanelTitle>
      </U.PanelHeader>
      <U.PanelText>
        The three figures in the homepage hero. Keep them short; leave a
        field blank to hide it.
      </U.PanelText>
      <F.Form onSubmit={submit} noValidate>
        <F.Grid>
          <TextField idPrefix="sitestats" name="profileViews" label="Views" defaultValue={site.profileStats.views} />
          <TextField idPrefix="sitestats" name="profileProjects" label="Projects" defaultValue={site.profileStats.projects} />
          <TextField idPrefix="sitestats" name="profileLikes" label="Likes" defaultValue={site.profileStats.likes} />
        </F.Grid>
        <F.Actions>
          <U.PrimaryAction type="submit" disabled={busy}>
            <Save size={16} strokeWidth={2} aria-hidden="true" />
            {busy ? 'Saving…' : 'Save profile stats'}
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
  const standardSizes = [10, 15, 20]
  const pageSizes = standardSizes.includes(settings.inquiriesPageSize)
    ? standardSizes
    : [...standardSizes, settings.inquiriesPageSize].sort((a, b) => a - b)

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
            {pageSizes.map((size) => (
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
