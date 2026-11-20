import styled from 'styled-components'

/*
 * Route-level states render outside RootLayout (hydration fallback and route
 * error), so they own the page shell that normally comes from the layout.
 */

export const Page = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background.default};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`

/* Minimal brand row: the top bar's brand lockup without navigation or actions. */
export const BrandRow = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const BrandLockup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  min-height: calc(var(--top-bar-height) - env(safe-area-inset-top, 0px));
  margin-inline: auto;
  padding: env(safe-area-inset-top) ${({ theme }) => theme.spacing.lg} 0;
`

/* Mirrors MainInner so the page hero skeleton's negative offset stays exact. */
export const Body = styled.main`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  margin-inline: auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  padding-bottom: calc(6rem + env(safe-area-inset-bottom));

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-bottom: ${({ theme }) => theme.spacing.xl};
  }
`

export const ContentSection = styled.section`
  padding-block: 2.5rem;
`

export const Prose = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 44rem;
`

/* Centers the standalone error panel in the space under the brand row. */
export const ErrorBody = styled.main`
  display: grid;
  place-items: center;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  min-height: calc(100vh - var(--top-bar-height));
  min-height: calc(100dvh - var(--top-bar-height));
  margin-inline: auto;
  padding: clamp(3.5rem, 8vw, 5.5rem) ${({ theme }) => theme.spacing.lg};
`
