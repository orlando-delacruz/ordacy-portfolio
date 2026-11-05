import {
  CircleCheck,
  FilePenLine,
  FolderPlus,
  Inbox,
  Loader,
  RotateCw,
  Search,
  Sparkle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { InquiryStatus } from '@/data'
import {
  faqsService,
  galleryService,
  getInquiryStats,
  inquiryStatuses,
  projectsService,
  servicesService,
  testimonialsService,
} from '@/services'
import type { InquiryStats } from '@/services'
import { AdminPage } from '../components/AdminPage'
import { ErrorState, LoadingState } from '../components/States'
import * as U from '../components/styles/admin-ui.styled'
import { formatDateTime } from '../format'
import type { LoadStatus } from '../hooks/useCollection'
import { inquiryStatusMeta } from '../inquiries/inquiryStatus'
import * as S from './styles/dashboard.styled'

type ContentSummary = { label: string; value: string; to: string }[]

async function loadDashboard() {
  const [stats, projects, testimonials, services, faqs, gallery] =
    await Promise.all([
      getInquiryStats(),
      projectsService.list(),
      testimonialsService.list(),
      servicesService.list(),
      faqsService.list(),
      galleryService.list(),
    ])

  const of = (part: number, all: number) => `${part} of ${all}`
  const content: ContentSummary = [
    {
      label: 'Published projects',
      value: of(projects.filter((p) => p.isPublished).length, projects.length),
      to: '/admin/projects',
    },
    {
      label: 'Approved testimonials',
      value: of(
        testimonials.filter((t) => t.status === 'approved' && !t.isSample).length,
        testimonials.length,
      ),
      to: '/admin/testimonials',
    },
    {
      label: 'Visible services',
      value: of(services.filter((s) => s.isPublished).length, services.length),
      to: '/admin/services',
    },
    {
      label: 'Published FAQs',
      value: of(faqs.filter((f) => f.isPublished).length, faqs.length),
      to: '/admin/faqs',
    },
    {
      label: 'Gallery images',
      value: String(gallery.length),
      to: '/admin/gallery',
    },
  ]
  const sampleContent =
    projects.filter((p) => p.isSample).length +
    testimonials.filter((t) => t.isSample).length +
    gallery.filter((image) => image.isSample).length

  return { stats, content, sampleContent }
}

type DashboardData = Awaited<ReturnType<typeof loadDashboard>>

const statCards: { key: keyof InquiryStats & ('total' | InquiryStatus); label: string; icon: LucideIcon }[] = [
  { key: 'total', label: 'Total Inquiries', icon: Inbox },
  { key: 'new', label: 'New Inquiries', icon: Sparkle },
  { key: 'in-progress', label: 'In Progress', icon: Loader },
  { key: 'completed', label: 'Completed', icon: CircleCheck },
]

const quickActions: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Review inquiries', to: '/admin/inquiries', icon: Inbox },
  { label: 'Add a project', to: '/admin/projects', icon: FolderPlus },
  { label: 'Edit page content', to: '/admin/content', icon: FilePenLine },
  { label: 'Update SEO', to: '/admin/seo', icon: Search },
]

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    loadDashboard().then(
      (next) => {
        if (!active) return
        setData(next)
        setStatus('ready')
      },
      () => active && setStatus('error'),
    )
    return () => {
      active = false
    }
  }, [version])

  const refresh = useCallback(() => {
    setStatus('loading')
    setVersion((value) => value + 1)
  }, [])

  return (
    <AdminPage
      navId="dashboard"
      actions={
        <U.SecondaryAction type="button" onClick={refresh}>
          <RotateCw size={16} strokeWidth={2} aria-hidden="true" />
          Refresh
        </U.SecondaryAction>
      }
    >
      {status === 'loading' && <LoadingState label="Loading dashboard…" />}
      {status === 'error' && <ErrorState onRetry={refresh} />}
      {status === 'ready' && data && <Dashboard data={data} />}
    </AdminPage>
  )
}

function Dashboard({ data }: { data: DashboardData }) {
  const { stats, content, sampleContent } = data

  return (
    <>
      {stats.sampleCount > 0 && (
        <S.Caption>
          Includes {stats.sampleCount} sample{' '}
          {stats.sampleCount === 1 ? 'inquiry' : 'inquiries'}.
        </S.Caption>
      )}

      <S.Stats>
        {statCards.map(({ key, label, icon: Icon }) => (
          <S.Stat key={key}>
            <S.StatIcon aria-hidden="true">
              <Icon size={18} strokeWidth={2} />
            </S.StatIcon>
            <S.StatLabel>{label}</S.StatLabel>
            <S.StatValue>{stats[key]}</S.StatValue>
          </S.Stat>
        ))}
      </S.Stats>

      <S.Columns>
        <U.Panel aria-labelledby="dash-recent">
          <U.PanelHeader>
            <U.PanelTitle id="dash-recent">Recent inquiries</U.PanelTitle>
            <S.PanelLink to="/admin/inquiries">View all</S.PanelLink>
          </U.PanelHeader>
          {stats.recent.length === 0 ? (
            <U.PanelText>
              No inquiries yet. Submissions from the contact form will appear
              here.
            </U.PanelText>
          ) : (
            <S.RecentList>
              {stats.recent.map((inquiry) => {
                const meta = inquiryStatusMeta[inquiry.status]
                return (
                  <li key={inquiry.id}>
                    <U.CellStrong>
                      <strong>{inquiry.fullName}</strong>
                      <span>
                        {inquiry.projectType ?? 'Project type not given'} ·{' '}
                        {formatDateTime(inquiry.submittedAt)}
                      </span>
                    </U.CellStrong>
                    <U.Badge $tone={meta.tone}>{meta.label}</U.Badge>
                  </li>
                )
              })}
            </S.RecentList>
          )}
        </U.Panel>

        <U.Panel aria-labelledby="dash-status">
          <U.PanelHeader>
            <U.PanelTitle id="dash-status">Status distribution</U.PanelTitle>
          </U.PanelHeader>
          {stats.total === 0 ? (
            <U.PanelText>Nothing to chart until inquiries arrive.</U.PanelText>
          ) : (
            <>
              <S.Bar role="img" aria-label={inquiryStatuses.map((s) => `${inquiryStatusMeta[s].label}: ${stats[s]}`).join(', ')}>
                {inquiryStatuses.map((s) =>
                  stats[s] > 0 ? (
                    <S.BarSegment
                      key={s}
                      $tone={inquiryStatusMeta[s].tone}
                      $weight={stats[s]}
                    />
                  ) : null,
                )}
              </S.Bar>
              <S.Legend>
                {inquiryStatuses.map((s) => (
                  <li key={s}>
                    <S.Swatch $tone={inquiryStatusMeta[s].tone} aria-hidden="true" />
                    <span>{inquiryStatusMeta[s].label}</span>
                    <strong>
                      {stats[s]} ({Math.round((stats[s] / stats.total) * 100)}%)
                    </strong>
                  </li>
                ))}
              </S.Legend>
            </>
          )}
        </U.Panel>
      </S.Columns>

      <S.Columns>
        <U.Panel aria-labelledby="dash-content">
          <U.PanelHeader>
            <U.PanelTitle id="dash-content">Website content</U.PanelTitle>
          </U.PanelHeader>
          <S.ContentList>
            {content.map((item) => (
              <li key={item.label}>
                <Link to={item.to}>{item.label}</Link>
                <strong>{item.value}</strong>
              </li>
            ))}
          </S.ContentList>
          {sampleContent > 0 && (
            <U.PanelText>
              Includes {sampleContent} sample records. Sample content is never
              published.
            </U.PanelText>
          )}
        </U.Panel>

        <U.Panel aria-labelledby="dash-actions">
          <U.PanelHeader>
            <U.PanelTitle id="dash-actions">Quick actions</U.PanelTitle>
          </U.PanelHeader>
          <S.Actions>
            {quickActions.map(({ label, to, icon: Icon }) => (
              <U.SecondaryButton key={to} to={to}>
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
                {label}
              </U.SecondaryButton>
            ))}
          </S.Actions>
        </U.Panel>
      </S.Columns>
    </>
  )
}
