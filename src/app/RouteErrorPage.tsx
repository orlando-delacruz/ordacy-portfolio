import { RotateCcw } from 'lucide-react'
import { PublicThemeProvider } from '@/components/layout/PublicThemeProvider'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import { StatePanel } from '@/components/state/StatePanel'
import {
  PrimaryAction,
  SecondaryButton,
} from '@/components/ui/styles/buttons.styled'
import { sharedStateCopy } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import * as S from './styles/route-state.styled'

/**
 * Public route error boundary. It replaces the layout, keeps the friendly
 * shared copy, and never exposes the raw router error.
 */
export function RouteErrorPage() {
  usePageMeta({
    path: '*',
    title: 'Something went wrong | Ordacy',
    description: 'The page could not be loaded. Try again or return home.',
    canonical: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    noindex: true,
  })

  const copy = sharedStateCopy('error')

  return (
    <PublicThemeProvider>
      <S.Page>
        <S.BrandRow>
          <S.BrandLockup>
            <BrandLogo />
            <Wordmark />
          </S.BrandLockup>
        </S.BrandRow>

        <S.ErrorBody>
          <StatePanel
            tone="error"
            headingLevel={1}
            title={copy.title}
            description={copy.description}
            actions={
              <>
                <PrimaryAction
                  type="button"
                  onClick={() => window.location.reload()}
                >
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
        </S.ErrorBody>
      </S.Page>
    </PublicThemeProvider>
  )
}
