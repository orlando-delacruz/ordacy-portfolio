import { Eye, Inbox, RotateCw, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import type { InquiryRecord, InquiryStatus } from '@/data'
import {
  inquiriesService,
  inquiryStatuses,
  queryInquiries,
  settingsService,
} from '@/services'
import type { InquiryPage } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Pagination } from '../components/Pagination'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { useToast } from '../components/toast-context'
import { formatDateTime } from '../format'
import { useDocument } from '../hooks/useCollection'
import type { LoadStatus } from '../hooks/useCollection'
import { InquiryDetails } from './InquiryDetails'
import { inquiryStatusMeta } from './inquiryStatus'

const PAGE_SIZES = [10, 15, 20] as const

type Dialog =
  | { kind: 'details'; inquiry: InquiryRecord; trigger: HTMLButtonElement }
  | { kind: 'delete'; inquiry: InquiryRecord; trigger: HTMLButtonElement }
  | null

export function InquiriesPage() {
  const toast = useToast()
  const { value: settings } = useDocument(settingsService)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<InquiryStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [chosenPageSize, setChosenPageSize] = useState<number | null>(null)
  const [result, setResult] = useState<InquiryPage | null>(null)
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading')
  const [version, setVersion] = useState(0)
  const [dialog, setDialog] = useState<Dialog>(null)

  const pageSize = chosenPageSize ?? settings?.inquiriesPageSize ?? 10

  useEffect(() => {
    let active = true
    queryInquiries({ search, status, page, pageSize }).then(
      (next) => {
        if (!active) return
        setResult(next)
        setLoadStatus('ready')
      },
      () => active && setLoadStatus('error'),
    )
    return () => {
      active = false
    }
  }, [search, status, page, pageSize, version])

  const reload = useCallback(() => setVersion((value) => value + 1), [])

  const refresh = () => {
    setLoadStatus('loading')
    reload()
  }

  const changeStatus = async (inquiry: InquiryRecord, next: InquiryStatus) => {
    try {
      await inquiriesService.update(inquiry.id, { status: next })
      toast.show(
        `${inquiry.fullName} marked ${inquiryStatusMeta[next].label}.`,
        'success',
      )
      reload()
      setDialog((current) =>
        current?.kind === 'details' && current.inquiry.id === inquiry.id
          ? { ...current, inquiry: { ...inquiry, status: next } }
          : current,
      )
    } catch {
      toast.show('Could not update the status. Try again.', 'error')
    }
  }

  const remove = async (inquiry: InquiryRecord) => {
    try {
      await inquiriesService.remove(inquiry.id)
      toast.show(`Inquiry from ${inquiry.fullName} deleted.`, 'success')
      reload()
      return true
    } catch {
      toast.show('Could not delete the inquiry. Try again.', 'error')
      return false
    }
  }

  const open =
    (kind: 'details' | 'delete', inquiry: InquiryRecord) =>
    (event: MouseEvent<HTMLButtonElement>) =>
      setDialog({ kind, inquiry, trigger: event.currentTarget })

  const filtered = search.trim() !== '' || status !== 'all'

  return (
    <AdminPage
      navId="inquiries"
      actions={
        <U.SecondaryAction type="button" onClick={refresh}>
          <RotateCw size={16} strokeWidth={2} aria-hidden="true" />
          Refresh
        </U.SecondaryAction>
      }
    >
      <U.Toolbar>
        <F.Search>
          <Search size={16} strokeWidth={2} aria-hidden="true" />
          <F.Input
            type="search"
            aria-label="Search by name or email"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
        </F.Search>
        <F.Select
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as InquiryStatus | 'all')
            setPage(1)
          }}
        >
          <option value="all">All statuses</option>
          {inquiryStatuses.map((value) => (
            <option key={value} value={value}>
              {inquiryStatusMeta[value].label}
            </option>
          ))}
        </F.Select>
        <U.ToolbarSpacer />
        {result && (
          <U.Count aria-live="polite">
            {result.total} {result.total === 1 ? 'inquiry' : 'inquiries'}
            {filtered ? ' found' : ''}
          </U.Count>
        )}
      </U.Toolbar>

      {loadStatus === 'loading' && !result && <LoadingState label="Loading inquiries…" />}
      {loadStatus === 'error' && <ErrorState onRetry={refresh} />}

      {loadStatus !== 'error' && result && result.total === 0 && (
        <EmptyState
          icon={Inbox}
          title={filtered ? 'No inquiries match.' : 'No inquiries yet.'}
          text={
            filtered
              ? 'Try another name, email, or status.'
              : 'Inquiries submitted through the contact form will appear here.'
          }
        />
      )}

      {loadStatus !== 'error' && result && result.total > 0 && (
        <>
          <U.TableWrap aria-busy={loadStatus === 'loading'}>
            <U.Table>
              <thead>
                <tr>
                  <th scope="col">Inquiry</th>
                  <th scope="col">Project type</th>
                  <th scope="col">Budget</th>
                  <th scope="col">Submitted</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <U.CellStrong>
                        <strong>{inquiry.fullName}</strong>
                        <span>{inquiry.email}</span>
                      </U.CellStrong>
                      {inquiry.isSample && <U.Badge $tone="neutral">Sample</U.Badge>}
                    </td>
                    <td data-label="Project">
                      {inquiry.projectType ?? <U.Muted>Not given</U.Muted>}
                    </td>
                    <td data-label="Budget">
                      {inquiry.budgetRange ?? <U.Muted>Not sure yet</U.Muted>}
                    </td>
                    <td data-label="Submitted">
                      <time dateTime={inquiry.submittedAt}>
                        {formatDateTime(inquiry.submittedAt)}
                      </time>
                    </td>
                    <td data-label="Status">
                      <F.Select
                        aria-label={`Status for ${inquiry.fullName}`}
                        value={inquiry.status}
                        onChange={(event) =>
                          changeStatus(inquiry, event.target.value as InquiryStatus)
                        }
                      >
                        {inquiryStatuses.map((value) => (
                          <option key={value} value={value}>
                            {inquiryStatusMeta[value].label}
                          </option>
                        ))}
                      </F.Select>
                    </td>
                    <td>
                      <U.RowActions>
                        <U.IconButton
                          type="button"
                          aria-label={`View inquiry from ${inquiry.fullName}`}
                          aria-haspopup="dialog"
                          onClick={open('details', inquiry)}
                        >
                          <Eye size={16} strokeWidth={2} aria-hidden="true" />
                        </U.IconButton>
                        <U.IconButton
                          type="button"
                          $danger
                          aria-label={`Delete inquiry from ${inquiry.fullName}`}
                          aria-haspopup="dialog"
                          onClick={open('delete', inquiry)}
                        >
                          <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                        </U.IconButton>
                      </U.RowActions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </U.Table>
          </U.TableWrap>

          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            pageSize={pageSize}
            pageSizes={PAGE_SIZES}
            total={result.total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setChosenPageSize(size)
              setPage(1)
            }}
          />
        </>
      )}

      {dialog?.kind === 'details' && (
        <InquiryDetails
          inquiry={dialog.inquiry}
          returnFocusTo={dialog.trigger}
          onClose={() => setDialog(null)}
          onStatusChange={(next) => changeStatus(dialog.inquiry, next)}
        />
      )}

      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title="Delete this inquiry?"
          message={`The inquiry from ${dialog.inquiry.fullName} (${dialog.inquiry.email}) will be permanently removed. This cannot be undone.`}
          onConfirm={() => remove(dialog.inquiry)}
          onClose={() => setDialog(null)}
          returnFocusTo={dialog.trigger}
        />
      )}
    </AdminPage>
  )
}
