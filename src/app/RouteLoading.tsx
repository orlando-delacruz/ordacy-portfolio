import { PublicThemeProvider } from '@/components/layout/PublicThemeProvider'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import {
  SkeletonLine,
  SkeletonPage,
} from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonCardGrid,
  SkeletonCta,
  SkeletonPageHero,
  SkeletonSectionHead,
} from '@/components/skeletons/SkeletonSections'
import * as S from './styles/route-state.styled'

const proseLines = ['96%', '88%', '64%']

/**
 * Initial-load skeleton for the public router. It renders before any lazy
 * route module resolves, so it owns its shell and imports no page data.
 */
export function RouteLoading() {
  return (
    <PublicThemeProvider>
      <S.Page>
        <S.BrandRow>
          <S.BrandLockup>
            <BrandLogo />
            <Wordmark />
          </S.BrandLockup>
        </S.BrandRow>

        <S.Body>
          <SkeletonPage label="Loading page">
            <SkeletonPageHero />
            <S.ContentSection>
              <SkeletonSectionHead />
              <S.Prose>
                {proseLines.map((width) => (
                  <SkeletonLine key={width} $w={width} />
                ))}
              </S.Prose>
            </S.ContentSection>
            <SkeletonCardGrid />
            <SkeletonCta />
          </SkeletonPage>
        </S.Body>
      </S.Page>
    </PublicThemeProvider>
  )
}
