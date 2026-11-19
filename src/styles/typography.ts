export const fontFamily =
  "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif"

/**
 * Public type is fluid between 320px and 1440px: 88% of its base size on the
 * smallest phone and 100% from 1440px up. Admin keeps the fixed base scale.
 */
const FLUID_MIN_RATIO = 0.88
const FLUID_MIN_VIEWPORT_REM = 20
const FLUID_MAX_VIEWPORT_REM = 90
const FLUID_SPAN_REM = FLUID_MAX_VIEWPORT_REM - FLUID_MIN_VIEWPORT_REM

export function fluidFont(rem: number): string {
  const min = rem * FLUID_MIN_RATIO
  const slope = (rem - min) / FLUID_SPAN_REM
  return `clamp(${min}rem, calc(${min}rem + ${slope.toFixed(6)} * (100vw - ${FLUID_MIN_VIEWPORT_REM}rem)), ${rem}rem)`
}

const fixedFontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  '4xl': '2.5rem',
} as const

export type FontSize = keyof typeof fixedFontSizes
export type FontSizes = Record<FontSize, string>

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const

export const lineHeights = {
  tight: 1.5,
  normal: 1.5,
  relaxed: 1.5,
} as const

/** Fixed scale used by the admin and the root application theme. */
export const typography = {
  fontFamily,
  fontSizes: fixedFontSizes as FontSizes,
  fontWeights,
  lineHeights,
} as const

/** Fluid scale used by every public route through RootLayout. */
export const fluidTypography = {
  ...typography,
  fontSizes: {
    xs: fluidFont(0.75),
    sm: fluidFont(0.875),
    md: fluidFont(1),
    lg: fluidFont(1.125),
    xl: fluidFont(1.25),
    '2xl': fluidFont(1.5),
    '3xl': fluidFont(2),
    '4xl': fluidFont(2.5),
  } satisfies FontSizes,
} as const
