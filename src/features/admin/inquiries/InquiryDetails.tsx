import { Mail, TriangleAlert } from 'lucide-react'
import { Lightbox } from '@/components/ui/Lightbox'
import type { InquiryRecord, InquiryStatus } from '@/data'
import { inquiryStatuses } from '@/services'
import * as F from '../components/styles/form.styled'
import * as U from '../components/styles/admin-ui.styled'
import { formatDate, formatDateTime } from '../format'
import { inquiryStatusMeta } from './inquiryStatus'

type InquiryDetailsProps = {
  inquiry: InquiryRecord
  returnFocusTo: HTMLButtonElement | null
  onClose: () => void
  onStatusChange: (status: InquiryStatus) => void
}

/** Centered modal with every field of one inquiry. */
export function InquiryDetails({
  inquiry,
  returnFocusTo,
  onClose,
  onStatusChange,
}: InquiryDetailsProps) {
  const notGiven = <U.Muted>Not given</U.Muted>

  return (
    <Lightbox
      title={`Inquiry from ${inquiry.fullName}`}
      closeLabel="Close inquiry details"
      onClose={onClose}
      returnFocusTo={returnFocusTo}
    >
      <U.DialogBody>
        {inquiry.isSample && (
          <U.Notice $tone="warning">
            <TriangleAlert size={16} strokeWidth={2} aria-hidden="true" />
            <span>Sample record, not a real inquiry.</span>
          </U.Notice>
        )}

        <U.DefinitionList>
          <div>
            <dt>Full name</dt>
            <dd>{inquiry.fullName}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
            </dd>
          </div>
          <div>
            <dt>Business / company</dt>
            <dd>{inquiry.company ?? notGiven}</dd>
          </div>
          <div>
            <dt>Project type</dt>
            <dd>{inquiry.projectType ?? notGiven}</dd>
          </div>
          <div>
            <dt>Budget range</dt>
            <dd>{inquiry.budgetRange ?? <U.Muted>Not sure yet</U.Muted>}</dd>
          </div>
          <div>
            <dt>Submitted</dt>
            <dd>
              <time dateTime={inquiry.submittedAt}>
                {formatDateTime(inquiry.submittedAt)}
              </time>
            </dd>
          </div>
          <div>
            <dt>Target launch date</dt>
            <dd>
              {inquiry.targetLaunchDate ? formatDate(inquiry.targetLaunchDate) : <U.Muted>Not given</U.Muted>}
            </dd>
          </div>
          <div data-wide>
            <dt>Project details</dt>
            <dd>{inquiry.details}</dd>
          </div>
        </U.DefinitionList>

        <F.Actions>
          <F.Field>
            <F.Label htmlFor="inquiry-detail-status">Status</F.Label>
            <F.Select
              id="inquiry-detail-status"
              value={inquiry.status}
              onChange={(event) =>
                onStatusChange(event.target.value as InquiryStatus)
              }
            >
              {inquiryStatuses.map((value) => (
                <option key={value} value={value}>
                  {inquiryStatusMeta[value].label}
                </option>
              ))}
            </F.Select>
          </F.Field>
          <U.ToolbarSpacer />
          <U.PrimaryAnchor href={`mailto:${inquiry.email}`}>
            <Mail size={16} strokeWidth={2} aria-hidden="true" />
            Reply by email
          </U.PrimaryAnchor>
        </F.Actions>
      </U.DialogBody>
    </Lightbox>
  )
}
