import type { InquiryStatus } from '@/data'
import type { Tone } from '../components/styles/admin-ui.styled'

export const inquiryStatusMeta: Record<InquiryStatus, { label: string; tone: Tone }> = {
  new: { label: 'New', tone: 'info' },
  'in-progress': { label: 'In Progress', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
}
