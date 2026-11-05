import { FolderKanban, Plus } from 'lucide-react'
import { useState } from 'react'
import type { ProjectRecord, ProjectShot, ProjectType } from '@/data'
import { projectsService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FormDialog } from '../components/FormDialog'
import type { FieldErrors } from '../components/FormDialog'
import { EditDeleteButtons, IconSelect, OrderButtons } from '../components/RecordControls'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { byOrder, formatDate, isHttpUrl, lines, move, renumber, slugify, text } from '../format'
import { useCollection } from '../hooks/useCollection'

type Dialog =
  | { kind: 'edit'; record: ProjectRecord | null; trigger: HTMLButtonElement }
  | { kind: 'delete'; record: ProjectRecord; trigger: HTMLButtonElement }
  | null

const projectTypeLabels: Record<ProjectType, string> = {
  'client-project': 'Client project',
  'concept-demo': 'Concept demo',
}

/** "url | alt text" per line. */
const parseShots = (value: string): ProjectShot[] =>
  lines(value).map((line) => {
    const [src = '', alt = ''] = line.split('|').map((part) => part.trim())
    return { src, alt }
  })

const shotsToText = (shots: readonly ProjectShot[]) =>
  shots.map((shot) => `${shot.src} | ${shot.alt}`).join('\n')

function validate(data: FormData, others: ProjectRecord[]): FieldErrors {
  const errors: FieldErrors = {}
  const title = text(data, 'title')
  if (!title) errors.title = 'Enter a project title.'
  const slug = slugify(text(data, 'slug') || title)
  if (slug && others.some((project) => project.slug === slug)) {
    errors.slug = 'Another project already uses this slug.'
  }
  if (!text(data, 'category')) errors.category = 'Enter a category.'
  if (text(data, 'summary').length < 20) errors.summary = 'Write a summary (at least 20 characters).'
  if (!isHttpUrl(text(data, 'imageSrc'))) errors.imageSrc = 'Enter a full image URL (https://…).'
  if (!text(data, 'imageAlt')) errors.imageAlt = 'Describe the image for screen reader users.'
  const url = text(data, 'url')
  if (url && !isHttpUrl(url)) errors.url = 'Enter a full URL (https://…) or leave it empty.'
  const shots = parseShots(text(data, 'screenshots'))
  if (shots.some((shot) => !(isHttpUrl(shot.src) || shot.src.startsWith('/')) || !shot.alt)) {
    errors.screenshots = 'Each line needs an image URL or /path, a "|", and alt text.'
  }
  return errors
}

export function ProjectsAdminPage() {
  const { items, status, refresh, mutate } = useCollection(projectsService)
  const [dialog, setDialog] = useState<Dialog>(null)
  const projects = [...items].sort(byOrder)
  const samples = projects.filter((project) => project.isSample).length

  const save = (record: ProjectRecord | null, data: FormData) => {
    const now = new Date().toISOString()
    const title = text(data, 'title')
    const slug = slugify(text(data, 'slug') || title)
    const fields = {
      title,
      slug,
      type: text(data, 'type') as ProjectType,
      icon: text(data, 'icon'),
      category: text(data, 'category'),
      summary: text(data, 'summary'),
      details: text(data, 'details'),
      challenge: text(data, 'challenge'),
      solution: text(data, 'solution'),
      features: lines(text(data, 'features')),
      image: { src: text(data, 'imageSrc'), alt: text(data, 'imageAlt') },
      screenshots: parseShots(text(data, 'screenshots')),
      url: text(data, 'url') || null,
      isPublished: !record?.isSample && data.get('isPublished') === 'on',
      updatedAt: now,
    }
    return record
      ? mutate(() => projectsService.update(record.id, fields), 'Project saved.')
      : mutate(
          () =>
            projectsService.create({
              id: slug,
              ...fields,
              isSample: false,
              displayOrder: projects.length + 1,
              createdAt: now,
            }),
          'Project added.',
        )
  }

  return (
    <AdminPage
      navId="projects"
      actions={
        <U.PrimaryAction
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => setDialog({ kind: 'edit', record: null, trigger: event.currentTarget })}
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Add project
        </U.PrimaryAction>
      }
    >
      {samples > 0 && (
        <U.Caption>
          Includes {samples} sample projects. Sample projects are never
          published.
        </U.Caption>
      )}

      {status === 'loading' && <LoadingState label="Loading projects…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet."
          text="Add a client project you have permission to show, or a clearly labeled concept demo."
        />
      )}
      {status === 'ready' && projects.length > 0 && (
        <U.TableWrap>
          <U.Table>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Type</th>
                <th scope="col">Category</th>
                <th scope="col">Published</th>
                <th scope="col">Updated</th>
                <th scope="col">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id}>
                  <td>
                    <U.CellStrong>
                      <strong>{project.title}</strong>
                      <span>/{project.slug}</span>
                    </U.CellStrong>
                    {project.isSample && <U.Badge $tone="neutral">Sample</U.Badge>}
                  </td>
                  <td data-label="Type">
                    <U.Badge $tone={project.type === 'concept-demo' ? 'warning' : 'info'}>
                      {projectTypeLabels[project.type]}
                    </U.Badge>
                  </td>
                  <td data-label="Category">{project.category}</td>
                  <td data-label="Published">
                    <F.Switch>
                      <input
                        type="checkbox"
                        checked={project.isPublished}
                        disabled={project.isSample}
                        title={project.isSample ? 'Sample record. Replace it with real content to publish.' : undefined}
                        aria-label={`Publish ${project.title}`}
                        onChange={() =>
                          mutate(
                            () =>
                              projectsService.update(project.id, {
                                isPublished: !project.isPublished,
                                updatedAt: new Date().toISOString(),
                              }),
                            project.isPublished ? `${project.title} unpublished.` : `${project.title} published.`,
                          )
                        }
                      />
                      <span aria-hidden="true">
                        {project.isSample ? 'Sample' : project.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </F.Switch>
                  </td>
                  <td data-label="Updated">{formatDate(project.updatedAt)}</td>
                  <td>
                    <U.RowActions>
                      <OrderButtons
                        label={project.title}
                        index={index}
                        count={projects.length}
                        onMove={(delta) =>
                          mutate(() => projectsService.replaceAll(move(projects, index, delta)), 'Project order updated.')
                        }
                      />
                      <EditDeleteButtons
                        label={project.title}
                        onEdit={(event) => setDialog({ kind: 'edit', record: project, trigger: event.currentTarget })}
                        onDelete={(event) => setDialog({ kind: 'delete', record: project, trigger: event.currentTarget })}
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
          title={dialog.record ? `Edit ${dialog.record.title}` : 'Add project'}
          submitLabel={dialog.record ? 'Save changes' : 'Add project'}
          validate={(data) =>
            validate(data, projects.filter((project) => project.id !== dialog.record?.id))
          }
          onSave={(data) => save(dialog.record, data)}
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        >
          {(errors) => (
            <ProjectFields
              record={dialog.record}
              errors={errors}
              categories={[...new Set(projects.map((project) => project.category))]}
            />
          )}
        </FormDialog>
      )}

      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title="Delete this project?"
          message={`${dialog.record.title} will be permanently removed from the site and the admin.`}
          onConfirm={() =>
            mutate(
              () =>
                projectsService.replaceAll(
                  renumber(projects.filter((project) => project.id !== dialog.record.id)),
                ),
              'Project deleted.',
            )
          }
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        />
      )}
    </AdminPage>
  )
}

type ProjectFieldsProps = {
  record: ProjectRecord | null
  errors: FieldErrors
  categories: string[]
}

function ProjectFields({ record, errors, categories }: ProjectFieldsProps) {
  const p = 'project'
  return (
    <>
      <F.Fieldset>
        <legend>Basics</legend>
        <F.Grid>
          <TextField idPrefix={p} name="title" label="Title" defaultValue={record?.title} error={errors.title} />
          <TextField
            idPrefix={p}
            name="slug"
            label="Slug"
            optional
            hint="Generated from the title when empty."
            defaultValue={record?.slug}
            error={errors.slug}
          />
          <F.Field>
            <F.Label htmlFor="project-type">Type</F.Label>
            <F.Select id="project-type" name="type" defaultValue={record?.type ?? 'client-project'}>
              <option value="client-project">Client project (shown with permission)</option>
              <option value="concept-demo">Concept demo (labeled as concept work)</option>
            </F.Select>
          </F.Field>
          <F.Field>
            <TextField
              idPrefix={p}
              name="category"
              label="Category"
              hint="Used for the filter on the Projects page."
              defaultValue={record?.category}
              error={errors.category}
              list="project-categories"
            />
            <datalist id="project-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </F.Field>
          <F.Field>
            <F.Label htmlFor="project-icon">Category icon</F.Label>
            <IconSelect id="project-icon" name="icon" defaultValue={record?.icon ?? 'FolderKanban'} />
          </F.Field>
          <F.Field>
            <F.Label as="span">Visibility</F.Label>
            <F.Switch>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={record?.isPublished ?? false}
                disabled={record?.isSample}
              />
              Published on the site
            </F.Switch>
            {record?.isSample && <F.Hint>Sample record. Replace it with real content to publish.</F.Hint>}
          </F.Field>
        </F.Grid>
      </F.Fieldset>

      <F.Fieldset>
        <legend>Description</legend>
        <TextField
          idPrefix={p}
          name="summary"
          label="Summary"
          multiline
          rows={2}
          softLimit={110}
          hint="Shown on the card and in the details dialog."
          defaultValue={record?.summary}
          error={errors.summary}
        />
        <TextField idPrefix={p} name="details" label="Overview" optional multiline defaultValue={record?.details} />
        <TextField
          idPrefix={p}
          name="challenge"
          label="Business challenge"
          optional
          multiline
          rows={3}
          defaultValue={record?.challenge}
        />
        <TextField
          idPrefix={p}
          name="solution"
          label="Proposed solution"
          optional
          multiline
          rows={3}
          defaultValue={record?.solution}
        />
        <TextField
          idPrefix={p}
          name="features"
          label="What it includes"
          optional
          multiline
          hint="One feature per line."
          defaultValue={record?.features.join('\n')}
        />
      </F.Fieldset>

      <F.Fieldset>
        <legend>Images and link</legend>
        <F.Grid>
          <TextField idPrefix={p} name="imageSrc" label="Thumbnail URL" type="url" defaultValue={record?.image.src} error={errors.imageSrc} />
          <TextField idPrefix={p} name="imageAlt" label="Thumbnail alt text" defaultValue={record?.image.alt} error={errors.imageAlt} />
          <TextField
            idPrefix={p}
            name="screenshots"
            label="Gallery screenshots"
            optional
            multiline
            hint="One per line: image URL or /path | alt text"
            defaultValue={record ? shotsToText(record.screenshots) : ''}
            error={errors.screenshots}
            wide
          />
          <TextField
            idPrefix={p}
            name="url"
            label="Live project URL"
            type="url"
            optional
            hint="Leave empty to hide the Visit button."
            defaultValue={record?.url}
            error={errors.url}
            wide
          />
        </F.Grid>
      </F.Fieldset>
    </>
  )
}
