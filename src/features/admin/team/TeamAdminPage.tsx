import { Plus, Users } from 'lucide-react'
import { useState } from 'react'
import type {
  TeamCertificationRecord,
  TeamEducationRecord,
  TeamExperienceRecord,
  TeamFact,
  TeamMemberRecord,
  TeamSkillGroup,
} from '@/data'
import { createId, saveOrder, teamService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FormDialog } from '../components/FormDialog'
import type { FieldErrors } from '../components/FormDialog'
import { EditDeleteButtons, OrderButtons } from '../components/RecordControls'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { byOrder, formatDate, isHttpUrl, lines, move, nextOrder, slugify, text } from '../format'
import { useCollection } from '../hooks/useCollection'

type Dialog =
  | { kind: 'edit'; record: TeamMemberRecord | null; trigger: HTMLButtonElement }
  | { kind: 'delete'; record: TeamMemberRecord; trigger: HTMLButtonElement }
  | null

const joinLines = (value: readonly string[]) => value.join('\n')

const factsToText = (facts: readonly TeamFact[]) =>
  facts.map((fact) => `${fact.label} | ${fact.value}`).join('\n')

const experienceToText = (entries: readonly TeamExperienceRecord[]) =>
  entries
    .map((entry) => `${entry.role} | ${entry.organization} | ${entry.period} | ${entry.summary}`)
    .join('\n')

const educationToText = (entries: readonly TeamEducationRecord[]) =>
  entries
    .map((entry) => `${entry.credential} | ${entry.school} | ${entry.period} | ${entry.details}`)
    .join('\n')

const certificationsToText = (entries: readonly TeamCertificationRecord[]) =>
  entries.map((entry) => `${entry.name} | ${entry.issuer} | ${entry.year}`).join('\n')

const skillGroupsToText = (groups: readonly TeamSkillGroup[]) =>
  groups.map((group) => `${group.label} | ${group.items.join(', ')}`).join('\n')

const parseFacts = (value: string): TeamFact[] =>
  lines(value).map((line) => {
    const [label = '', ...rest] = line.split('|')
    return { label: label.trim(), value: rest.join('|').trim() }
  })

/** "Role | Organization | Period | Summary" per line. */
const parseExperience = (value: string): TeamExperienceRecord[] =>
  lines(value).map((line) => {
    const [role = '', organization = '', period = '', ...rest] = line.split('|')
    return {
      role: role.trim(),
      organization: organization.trim(),
      period: period.trim(),
      summary: rest.join('|').trim(),
    }
  })

/** "Credential | School | Period | Details" per line. */
const parseEducation = (value: string): TeamEducationRecord[] =>
  lines(value).map((line) => {
    const [credential = '', school = '', period = '', ...rest] = line.split('|')
    return {
      credential: credential.trim(),
      school: school.trim(),
      period: period.trim(),
      details: rest.join('|').trim(),
    }
  })

/** "Name | Issuer | Year" per line. */
const parseCertifications = (value: string): TeamCertificationRecord[] =>
  lines(value).map((line) => {
    const [name = '', issuer = '', ...rest] = line.split('|')
    return { name: name.trim(), issuer: issuer.trim(), year: rest.join('|').trim() }
  })

/** "Label | item, item" per line. */
const parseSkillGroups = (value: string): TeamSkillGroup[] =>
  lines(value).map((line) => {
    const [label = '', ...rest] = line.split('|')
    return {
      label: label.trim(),
      items: rest
        .join('|')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }
  })

const isAssetRef = (value: string) =>
  value.startsWith('/') || isHttpUrl(value)

function validate(data: FormData, others: TeamMemberRecord[]): FieldErrors {
  const errors: FieldErrors = {}
  if (!text(data, 'name')) errors.name = 'Enter the member name.'
  if (!text(data, 'role')) errors.role = 'Enter the member role.'
  const slug = slugify(text(data, 'slug') || text(data, 'name'))
  if (!slug) errors.slug = 'Enter a slug for the profile URL.'
  else if (others.some((member) => member.slug === slug)) {
    errors.slug = 'Another member already uses this slug.'
  }
  if (!text(data, 'initials')) errors.initials = 'Enter initials for the avatar fallback.'
  const headline = text(data, 'headline')
  if (headline.length < 20) errors.headline = 'Write a headline (at least 20 characters).'
  if (text(data, 'summary').length < 20) errors.summary = 'Write a summary (at least 20 characters).'
  const avatarSrc = text(data, 'avatarSrc')
  if (avatarSrc && !isAssetRef(avatarSrc)) {
    errors.avatarSrc = 'Enter a full image URL (https://…) or a /path, or leave it empty.'
  }
  if (avatarSrc && !text(data, 'avatarAlt')) {
    errors.avatarAlt = 'Describe the photo for screen reader users.'
  }
  const avatarDarkSrc = text(data, 'avatarDarkSrc')
  if (avatarDarkSrc && !avatarSrc) {
    errors.avatarDarkSrc = 'Add the photo URL above before the dark-mode photo.'
  } else if (avatarDarkSrc && !isAssetRef(avatarDarkSrc)) {
    errors.avatarDarkSrc = 'Enter a full image URL (https://…) or a /path, or leave it empty.'
  }
  const resumeUrl = text(data, 'resumeUrl')
  if (resumeUrl && !isAssetRef(resumeUrl)) {
    errors.resumeUrl = 'Enter a full URL (https://…) or a /path, or leave it empty.'
  }
  if (parseFacts(text(data, 'facts')).some((fact) => !fact.label || !fact.value)) {
    errors.facts = 'Each line needs "Label | Value".'
  }
  if (
    parseExperience(text(data, 'experience')).some(
      (entry) => !entry.role || !entry.organization || !entry.period,
    )
  ) {
    errors.experience =
      'Each line needs "Role | Organization | Period", with an optional Summary after the last pipe.'
  }
  if (
    parseEducation(text(data, 'education')).some(
      (entry) => !entry.credential || !entry.school || !entry.period,
    )
  ) {
    errors.education = 'Each line needs "Credential | School | Period | Details".'
  }
  if (
    parseCertifications(text(data, 'certifications')).some(
      (entry) => !entry.name || !entry.issuer || !entry.year,
    )
  ) {
    errors.certifications = 'Each line needs "Name | Issuer | Year".'
  }
  if (
    parseSkillGroups(text(data, 'skillGroups')).some(
      (group) => !group.label || group.items.length === 0,
    )
  ) {
    errors.skillGroups = 'Each line needs "Label | item, item".'
  }
  return errors
}

export function TeamAdminPage() {
  const { items, status, refresh, mutate } = useCollection(teamService)
  const [dialog, setDialog] = useState<Dialog>(null)
  const members = [...items].sort(byOrder)

  const save = (record: TeamMemberRecord | null, data: FormData) => {
    const now = new Date().toISOString()
    const name = text(data, 'name')
    const slug = slugify(text(data, 'slug') || name)
    const avatarSrc = text(data, 'avatarSrc')
    const avatarDarkSrc = text(data, 'avatarDarkSrc')
    const fields = {
      slug,
      name,
      role: text(data, 'role'),
      initials: text(data, 'initials'),
      avatar: avatarSrc
        ? {
            src: avatarSrc,
            darkSrc: avatarDarkSrc || undefined,
            alt: text(data, 'avatarAlt'),
          }
        : null,
      resumeUrl: text(data, 'resumeUrl') || null,
      headline: text(data, 'headline'),
      summary: text(data, 'summary'),
      facts: parseFacts(text(data, 'facts')),
      skills: lines(text(data, 'skills')),
      skillGroups: parseSkillGroups(text(data, 'skillGroups')),
      experience: parseExperience(text(data, 'experience')),
      education: parseEducation(text(data, 'education')),
      certifications: parseCertifications(text(data, 'certifications')),
      languages: lines(text(data, 'languages')),
      isPublished: data.get('isPublished') === 'on',
      updatedAt: now,
    }
    return record
      ? mutate(() => teamService.update(record.id, fields), 'Team member saved.')
      : mutate(
          () =>
            teamService.create({
              id: createId('member'),
              ...fields,
              displayOrder: nextOrder(members),
              createdAt: now,
            }),
          'Team member added.',
        )
  }

  return (
    <AdminPage
      navId="team"
      actions={
        <U.PrimaryAction
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => setDialog({ kind: 'edit', record: null, trigger: event.currentTarget })}
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Add member
        </U.PrimaryAction>
      }
    >
      <U.Caption>
        Circles on the homepage and profile pages link to each member below.
        Empty resume sections stay hidden on the public site.
      </U.Caption>

      {status === 'loading' && <LoadingState label="Loading team…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' && members.length === 0 && (
        <EmptyState
          icon={Users}
          title="No team members yet."
          text="Add the people behind Ordacy so visitors can meet them on the homepage."
        />
      )}
      {status === 'ready' && members.length > 0 && (
        <U.TableWrap>
          <U.Table>
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Role</th>
                <th scope="col">Published</th>
                <th scope="col">Updated</th>
                <th scope="col">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id}>
                  <td>
                    <U.CellStrong>
                      <strong>{member.name}</strong>
                      <span>/team/{member.slug}</span>
                    </U.CellStrong>
                  </td>
                  <td data-label="Role">{member.role}</td>
                  <td data-label="Published">
                    <F.Switch>
                      <input
                        type="checkbox"
                        checked={member.isPublished}
                        aria-label={`Publish ${member.name}`}
                        onChange={() =>
                          mutate(
                            () =>
                              teamService.update(member.id, {
                                isPublished: !member.isPublished,
                                updatedAt: new Date().toISOString(),
                              }),
                            member.isPublished ? `${member.name} unpublished.` : `${member.name} published.`,
                          )
                        }
                      />
                      <span aria-hidden="true">
                        {member.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </F.Switch>
                  </td>
                  <td data-label="Updated">{formatDate(member.updatedAt)}</td>
                  <td>
                    <U.RowActions>
                      <OrderButtons
                        label={member.name}
                        index={index}
                        count={members.length}
                        onMove={(delta) =>
                          mutate(
                            () => saveOrder(teamService, members, move(members, index, delta)),
                            'Team order updated.',
                          )
                        }
                      />
                      <EditDeleteButtons
                        label={member.name}
                        onEdit={(event) => setDialog({ kind: 'edit', record: member, trigger: event.currentTarget })}
                        onDelete={(event) => setDialog({ kind: 'delete', record: member, trigger: event.currentTarget })}
                      />
                    </U.RowActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </U.Table>
        </U.TableWrap>
      )}

      {dialog?.kind === 'edit' && (
        <FormDialog
          title={dialog.record ? `Edit ${dialog.record.name}` : 'Add team member'}
          submitLabel={dialog.record ? 'Save changes' : 'Add member'}
          validate={(data) =>
            validate(data, members.filter((member) => member.id !== dialog.record?.id))
          }
          onSave={(data) => save(dialog.record, data)}
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        >
          {(errors) => (
            <MemberFields record={dialog.record} errors={errors} />
          )}
        </FormDialog>
      )}

      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title="Delete this team member?"
          message={`${dialog.record.name} will be permanently removed from the site and the admin.`}
          onConfirm={() =>
            mutate(
              () => teamService.remove(dialog.record.id),
              'Team member deleted.',
            )
          }
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        />
      )}
    </AdminPage>
  )
}

type MemberFieldsProps = {
  record: TeamMemberRecord | null
  errors: FieldErrors
}

function MemberFields({ record, errors }: MemberFieldsProps) {
  const p = 'member'
  return (
    <>
      <F.Fieldset>
        <legend>Basics</legend>
        <F.Grid>
          <TextField idPrefix={p} name="name" label="Name" defaultValue={record?.name} error={errors.name} />
          <TextField idPrefix={p} name="role" label="Role" defaultValue={record?.role} error={errors.role} />
          <TextField
            idPrefix={p}
            name="slug"
            label="Slug"
            optional
            hint="Profile URL: /team/<slug>. Generated from the name when empty."
            defaultValue={record?.slug}
            error={errors.slug}
          />
          <TextField
            idPrefix={p}
            name="initials"
            label="Initials"
            hint="Shown in the circle when there is no photo."
            defaultValue={record?.initials}
            error={errors.initials}
          />
          <TextField
            idPrefix={p}
            name="resumeUrl"
            label="Resume URL"
            optional
            type="url"
            hint="PDF path or full URL. Shows a Resume button beside Contact."
            defaultValue={record?.resumeUrl ?? ''}
            error={errors.resumeUrl}
          />
          <F.Field>
            <F.Label as="span">Visibility</F.Label>
            <F.Switch>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={record?.isPublished ?? true}
              />
              Published on the site
            </F.Switch>
          </F.Field>
        </F.Grid>
      </F.Fieldset>

      <F.Fieldset>
        <legend>Photo</legend>
        <F.Grid>
          <TextField
            idPrefix={p}
            name="avatarSrc"
            label="Photo URL"
            optional
            type="url"
            hint="Full URL or /path. Empty shows the initials instead."
            defaultValue={record?.avatar?.src}
            error={errors.avatarSrc}
          />
          <TextField
            idPrefix={p}
            name="avatarDarkSrc"
            label="Dark-mode photo URL"
            optional
            type="url"
            hint="Shown in dark theme. Empty uses the photo above."
            defaultValue={record?.avatar?.darkSrc}
            error={errors.avatarDarkSrc}
          />
          <TextField
            idPrefix={p}
            name="avatarAlt"
            label="Photo alt text"
            optional
            hint="Required when a photo is set."
            defaultValue={record?.avatar?.alt}
            error={errors.avatarAlt}
          />
        </F.Grid>
      </F.Fieldset>

      <F.Fieldset>
        <legend>Profile</legend>
        <TextField
          idPrefix={p}
          name="headline"
          label="Headline"
          multiline
          rows={2}
          softLimit={160}
          hint="One sentence shown in the hero and search results."
          defaultValue={record?.headline}
          error={errors.headline}
        />
        <TextField
          idPrefix={p}
          name="summary"
          label="Summary"
          multiline
          rows={4}
          hint="Two to four sentences for the resume profile."
          defaultValue={record?.summary}
          error={errors.summary}
        />
        <TextField
          idPrefix={p}
          name="facts"
          label="Hero facts"
          optional
          multiline
          rows={3}
          hint='"Label | Value" per line. Empty derives counts from the resume sections.'
          defaultValue={record ? factsToText(record.facts) : ''}
          error={errors.facts}
        />
      </F.Fieldset>

      <F.Fieldset>
        <legend>Resume</legend>
        <TextField
          idPrefix={p}
          name="skills"
          label="Skills"
          optional
          multiline
          rows={4}
          hint="One skill per line. Used when no skill groups are set."
          defaultValue={record ? joinLines(record.skills) : ''}
        />
        <TextField
          idPrefix={p}
          name="skillGroups"
          label="Skill groups"
          optional
          multiline
          rows={4}
          hint='"Label | item, item" per line. Replaces Skills as a full-width band.'
          defaultValue={record ? skillGroupsToText(record.skillGroups ?? []) : ''}
          error={errors.skillGroups}
        />
        <TextField
          idPrefix={p}
          name="experience"
          label="Experience"
          optional
          multiline
          rows={4}
          hint='"Role | Organization | Period | Summary (optional)" per line.'
          defaultValue={record ? experienceToText(record.experience) : ''}
          error={errors.experience}
        />
        <TextField
          idPrefix={p}
          name="education"
          label="Education"
          optional
          multiline
          rows={3}
          hint='"Credential | School | Period | Details" per line.'
          defaultValue={record ? educationToText(record.education) : ''}
          error={errors.education}
        />
        <TextField
          idPrefix={p}
          name="certifications"
          label="Certifications"
          optional
          multiline
          rows={2}
          hint='"Name | Issuer | Year" per line.'
          defaultValue={record ? certificationsToText(record.certifications) : ''}
          error={errors.certifications}
        />
        <TextField
          idPrefix={p}
          name="languages"
          label="Languages"
          optional
          multiline
          rows={2}
          hint="One language per line."
          defaultValue={record ? joinLines(record.languages) : ''}
        />
      </F.Fieldset>
    </>
  )
}
