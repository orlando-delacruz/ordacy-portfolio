import {
  FilePenLine,
  FolderPlus,
  Inbox,
  RotateCw,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  faqsService,
  galleryService,
  getInquiryStats,
  inquiryStatuses,
  projectsService,
  servicesService,
  testimonialsService,
} from '@/services'
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
        testimonials.filter((t) => t.status === 'approved').length,
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
  return { stats, content }
}

type DashboardData = Awaited<ReturnType<typeof loadDashboard>>

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
  const { stats, content } = data

  return (
    <>
      <S.Columns>
        <U.Panel aria-labelledby="dash-inbox">
          <U.PanelHeader>
            <U.PanelTitle id="dash-inbox">Inbox</U.PanelTitle>
            <S.PanelLink to="/admin/inquiries">Review inquiries</S.PanelLink>
          </U.PanelHeader>
          <S.InboxHead>
            <S.InboxTotal>{stats.total}</S.InboxTotal>
            <S.InboxLabel>
              {stats.total === 1 ? 'inquiry' : 'inquiries'} total
              {stats.new > 0 ? ` · ${stats.new} new` : ' · all caught up'}
            </S.InboxLabel>
          </S.InboxHead>
          {stats.total === 0 ? (
            <U.PanelText>
              No inquiries yet. Submissions from the contact form will appear
              here.
            </U.PanelText>
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
          {stats.recent.length > 0 && (
            <>
              <S.RecentHeading>Latest</S.RecentHeading>
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
            </>
          )}
        </U.Panel>

        <S.SideStack>
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
        </S.SideStack>
      </S.Columns>
    </>
  )
}
