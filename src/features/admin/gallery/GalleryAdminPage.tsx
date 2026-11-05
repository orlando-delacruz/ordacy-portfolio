import { CloudUpload, Images, Plus } from 'lucide-react'
import { useState } from 'react'
import type { GalleryImageRecord } from '@/data'
import { createId, galleryService } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FormDialog } from '../components/FormDialog'
import type { FieldErrors } from '../components/FormDialog'
import { EditDeleteButtons, OrderButtons } from '../components/RecordControls'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { TextField } from '../components/TextField'
import { byOrder, isHttpUrl, move, renumber, text } from '../format'
import { useCollection } from '../hooks/useCollection'
import * as S from './styles/gallery.styled'

type Dialog =
  | { kind: 'edit'; record: GalleryImageRecord | null; trigger: HTMLButtonElement }
  | { kind: 'delete'; record: GalleryImageRecord; trigger: HTMLButtonElement }
  | null

const validate = (data: FormData): FieldErrors => {
  const errors: FieldErrors = {}
  if (!isHttpUrl(text(data, 'src'))) errors.src = 'Enter a full image URL (https://…).'
  if (!text(data, 'title')) errors.title = 'Enter a title.'
  if (text(data, 'alt').length < 5) errors.alt = 'Describe what the image shows.'
  return errors
}

export function GalleryAdminPage() {
  const { items, status, refresh, mutate } = useCollection(galleryService)
  const [dialog, setDialog] = useState<Dialog>(null)
  const images = [...items].sort(byOrder)

  const save = (record: GalleryImageRecord | null, data: FormData) => {
    const fields = {
      src: text(data, 'src'),
      title: text(data, 'title'),
      alt: text(data, 'alt'),
      caption: text(data, 'caption') || null,
      isPublished: !record?.isSample && data.get('isPublished') === 'on',
    }
    return record
      ? mutate(() => galleryService.update(record.id, fields), 'Image details saved.')
      : mutate(
          () =>
            galleryService.create({
              id: createId('image'),
              ...fields,
              isSample: false,
              displayOrder: images.length + 1,
              createdAt: new Date().toISOString(),
            }),
          'Image added.',
        )
  }

  return (
    <AdminPage
      navId="gallery"
      actions={
        <U.PrimaryAction
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => setDialog({ kind: 'edit', record: null, trigger: event.currentTarget })}
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Add image by URL
        </U.PrimaryAction>
      }
    >
      <S.UploadPlaceholder>
        <CloudUpload size={22} strokeWidth={2} aria-hidden="true" />
        <div>
          <strong>File uploads are not available yet.</strong>
          <p>
            Uploading needs a storage service, which is not connected. Add
            images by URL for now.
          </p>
        </div>
      </S.UploadPlaceholder>

      {status === 'loading' && <LoadingState label="Loading gallery…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' && images.length === 0 && (
        <EmptyState
          icon={Images}
          title="No images yet."
          text="Add an image you own or have permission to use, with alt text describing it."
        />
      )}
      {status === 'ready' && images.length > 0 && (
        <S.Grid>
          {images.map((image, index) => (
            <S.Item key={image.id} $hidden={!image.isPublished}>
              <S.Thumb src={image.src} alt={image.alt} loading="lazy" decoding="async" />
              <S.Meta>
                <p>{image.title}</p>
                {image.caption && <span>{image.caption}</span>}
                <U.Badges>
                  {image.isSample && <U.Badge $tone="neutral">Sample</U.Badge>}
                  {!image.isPublished && !image.isSample && <U.Badge $tone="neutral">Hidden</U.Badge>}
                </U.Badges>
              </S.Meta>
              <U.RowActions>
                <F.Switch>
                  <input
                    type="checkbox"
                    checked={image.isPublished}
                    disabled={image.isSample}
                    title={image.isSample ? 'Sample record. Replace it with real content to publish.' : undefined}
                    aria-label={`Show ${image.title}`}
                    onChange={() =>
                      mutate(
                        () => galleryService.update(image.id, { isPublished: !image.isPublished }),
                        image.isPublished ? 'Image hidden.' : 'Image visible.',
                      )
                    }
                  />
                  <span aria-hidden="true">Visible</span>
                </F.Switch>
                <OrderButtons
                  label={image.title}
                  index={index}
                  count={images.length}
                  onMove={(delta) =>
                    mutate(() => galleryService.replaceAll(move(images, index, delta)), 'Image order updated.')
                  }
                />
                <EditDeleteButtons
                  label={image.title}
                  onEdit={(event) => setDialog({ kind: 'edit', record: image, trigger: event.currentTarget })}
                  onDelete={(event) => setDialog({ kind: 'delete', record: image, trigger: event.currentTarget })}
                />
              </U.RowActions>
            </S.Item>
          ))}
        </S.Grid>
      )}

      {dialog?.kind === 'edit' && (
        <FormDialog
          title={dialog.record ? 'Edit image details' : 'Add image by URL'}
          submitLabel={dialog.record ? 'Save changes' : 'Add image'}
          validate={validate}
          onSave={(data) => save(dialog.record, data)}
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        >
          {(errors) => (
            <>
              <TextField
                idPrefix="image"
                name="src"
                label="Image URL"
                type="url"
                hint="A publicly reachable https:// address."
                defaultValue={dialog.record?.src}
                error={errors.src}
              />
              <TextField idPrefix="image" name="title" label="Title" defaultValue={dialog.record?.title} error={errors.title} />
              <TextField
                idPrefix="image"
                name="alt"
                label="Alt text"
                softLimit={125}
                hint="What the image shows, for screen reader users."
                defaultValue={dialog.record?.alt}
                error={errors.alt}
              />
              <TextField idPrefix="image" name="caption" label="Caption" optional defaultValue={dialog.record?.caption} />
              <F.Switch>
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked={dialog.record?.isPublished ?? true}
                  disabled={dialog.record?.isSample}
                />
                Visible
              </F.Switch>
              {dialog.record?.isSample && <F.Hint>Sample record. Replace it with real content to publish.</F.Hint>}
            </>
          )}
        </FormDialog>
      )}

      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title="Delete this image?"
          message={`"${dialog.record.title}" will be permanently removed from the gallery.`}
          onConfirm={() =>
            mutate(
              () => galleryService.replaceAll(renumber(images.filter((image) => image.id !== dialog.record.id))),
              'Image deleted.',
            )
          }
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        />
      )}
    </AdminPage>
  )
}
