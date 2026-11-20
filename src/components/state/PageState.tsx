import { RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { pageStateCopy, sharedStateCopy } from '@/data'
import type { PageStateKey } from '@/data'
import {
  PrimaryAction,
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/styles/buttons.styled'
import { StatePanel } from './StatePanel'
import { usePublicPreviewState } from './usePublicPreviewState'
import * as S from './styles/page-state.styled'

type PageStateProps = {
  page: PageStateKey
  /** The real page hero, kept above empty and error panels. */
  hero: ReactNode
  /** The page-specific skeleton, replacing the whole page while loading. */
  skeleton: ReactNode
  /** A real empty collection. Preview-only empties come from `?state=empty`. */
  empty?: boolean
  children: ReactNode
}

/** Drops the dev preview query so a retry loads the real page. */
function retryPage() {
  if (import.meta.env.DEV) {
    const url = new URL(window.location.href)
    url.searchParams.delete('state')
    window.location.replace(url.toString())
    return
  }
  window.location.reload()
}

/**
 * Public page state wrapper. Order: loading replaces the page with its
 * skeleton, error/empty keep the hero and show a page-level panel, and
 * anything else (including a success preview) renders the real page.
 */
export function PageState({
  page,
  hero,
  skeleton,
  empty = false,
  children,
}: PageStateProps) {
  const preview = usePublicPreviewState()

  if (preview === 'loading') {
    return <>{skeleton}</>
  }

  if (preview === 'error') {
    const copy = sharedStateCopy('error')

    return (
      <>
        {hero}
        <S.PanelSection>
          <StatePanel
            tone="error"
            headingLevel={2}
            title={copy.title}
            description={copy.description}
            actions={
              <>
                <PrimaryAction type="button" onClick={retryPage}>
                  <RotateCcw size={18} strokeWidth={2} aria-hidden="true" />
                  Try again
                </PrimaryAction>
                {copy.actions.map(({ label, to, icon: Icon }) => (
                  <SecondaryButton key={`${to}-${label}`} to={to}>
                    <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    {label}
                  </SecondaryButton>
                ))}
              </>
            }
          />
        </S.PanelSection>
      </>
    )
  }

  if (preview === 'empty' || empty) {
    const copy = pageStateCopy(page)
    const [primary, ...secondary] = copy.actions
    const PrimaryIcon = primary?.icon

    return (
      <>
        {hero}
        <S.PanelSection>
          <StatePanel
            tone="empty"
            headingLevel={2}
            title={copy.title}
            description={copy.description}
            actions={
              copy.actions.length > 0 ? (
                <>
                  {primary && PrimaryIcon && (
                    <PrimaryButton to={primary.to}>
                      <PrimaryIcon
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      {primary.label}
                    </PrimaryButton>
                  )}
                  {secondary.map(({ label, to, icon: Icon }) => (
                    <SecondaryButton key={`${to}-${label}`} to={to}>
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      {label}
                    </SecondaryButton>
                  ))}
                </>
              ) : undefined
            }
          />
        </S.PanelSection>
      </>
    )
  }

  return (
    <>
      {hero}
      {children}
    </>
  )
}
