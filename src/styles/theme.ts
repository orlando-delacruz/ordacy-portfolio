import { breakpoints } from './breakpoints'
import { fluidTypography, typography } from './typography'

export type ThemeName = 'light' | 'dark'

const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
}

const radii = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  pill: '999px',
  round: '50%',
}

const transitions = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
}

// Shared motion language: state changes only, never decoration.
const motion = {
  duration: {
    instant: '100ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '450ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  },
}

const layout = {
  contentMaxWidth: '90rem',
  appMaxWidth: '105rem',
  readingMaxWidth: '68ch',
  formMaxWidth: '40rem',
}

const lightColors = {
  brand: {
    primary: '#00DAB9',
    secondary: '#00CDAF',
    deep: '#00585E',
    navy: '#00243E',
    white: '#FEFEFE',
  },
  background: {
    default: '#F1F7F4',
    subtle: '#E8F1EE',
    inverse: '#00243E',
  },
  surface: {
    default: '#FFFFFF',
    subtle: '#E8F1EE',
  },
  text: {
    primary: '#0B2233',
    secondary: '#52676B',
    accent: '#006B5E',
    inverse: '#FEFEFE',
  },
  border: {
    default: '#DDE8E4',
    focus: '#006B5E',
  },
  // Small accent cues only: brand navy for problems, brand teal for solutions.
  problem: {
    accent: '#0B2233',
  },
  solution: {
    accent: '#006B5E',
  },
  danger: {
    text: '#B42318',
  },
  // Admin status badges (inquiries, publishing). Text colors meet 4.5:1 on surfaces.
  status: {
    info: '#006B5E',
    warning: '#8A5300',
    success: '#1E6B3A',
    neutral: '#4A6670',
  },
}

const darkColors: typeof lightColors = {
  brand: {
    primary: '#00DAB9',
    secondary: '#00CDAF',
    deep: '#5FE7D4',
    navy: '#00243E',
    white: '#FEFEFE',
  },
  background: {
    default: '#061722',
    subtle: '#0E2938',
    inverse: '#F1F8F7',
  },
  surface: {
    default: '#0B2130',
    subtle: '#0E2938',
  },
  text: {
    primary: '#F1F7F6',
    secondary: '#A7C0C3',
    accent: '#5FE7D4',
    inverse: '#00243E',
  },
  border: {
    default: '#1B3A4A',
    focus: '#5FE7D4',
  },
  problem: {
    accent: '#A8C5C6',
  },
  solution: {
    accent: '#5FE7D4',
  },
  danger: {
    text: '#FF9A8F',
  },
  status: {
    info: '#5FE7D4',
    warning: '#F5C26B',
    success: '#7FD99A',
    neutral: '#A8C5C6',
  },
}

const lightShadows = {
  sm: '0 1px 2px rgba(11, 34, 51, 0.05)',
  md: '0 8px 24px rgba(11, 34, 51, 0.08)',
  lg: '0 20px 48px rgba(11, 34, 51, 0.12)',
}

const darkShadows: typeof lightShadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 8px 24px rgba(0, 0, 0, 0.35)',
  lg: '0 20px 48px rgba(0, 0, 0, 0.45)',
}

export type AppTheme = {
  mode: ThemeName
  colors: typeof lightColors
  shadows: typeof lightShadows
  typography: typeof typography
  spacing: typeof spacing
  radii: typeof radii
  breakpoints: typeof breakpoints
  transitions: typeof transitions
  motion: typeof motion
  layout: typeof layout
}

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: lightColors,
  shadows: lightShadows,
  typography,
  spacing,
  radii,
  breakpoints,
  transitions,
  motion,
  layout,
}

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: darkColors,
  shadows: darkShadows,
  typography,
  spacing,
  radii,
  breakpoints,
  transitions,
  motion,
  layout,
}

/* Public routes opt into the fluid scale; admin keeps the fixed root theme. */
export const fluidLightTheme: AppTheme = {
  ...lightTheme,
  typography: fluidTypography,
}

export const fluidDarkTheme: AppTheme = {
  ...darkTheme,
  typography: fluidTypography,
}
