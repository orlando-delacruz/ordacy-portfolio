import { breakpoints } from './breakpoints'
import { typography } from './typography'

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
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1.25rem',
  pill: '999px',
  round: '50%',
}

const transitions = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
}

const layout = {
  contentMaxWidth: '90rem',
  appMaxWidth: '105rem',
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
    default: '#FEFEFE',
    subtle: '#F1FBF9',
    inverse: '#00243E',
  },
  surface: {
    default: '#FEFEFE',
    subtle: '#F7FCFB',
  },
  text: {
    primary: '#00243E',
    secondary: '#00585E',
    accent: '#00585E',
    inverse: '#FEFEFE',
  },
  border: {
    default: '#D6E9E6',
    focus: '#00585E',
  },
  // Small accent cues only: brand navy for problems, brand teal for solutions.
  problem: {
    accent: '#00243E',
  },
  solution: {
    accent: '#00585E',
  },
  danger: {
    text: '#B42318',
  },
  // Admin status badges (inquiries, publishing). Text colors meet 4.5:1 on surfaces.
  status: {
    info: '#00585E',
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
    default: '#001A2C',
    subtle: '#062B42',
    inverse: '#F1F8F7',
  },
  surface: {
    default: '#022238',
    subtle: '#041E31',
  },
  text: {
    primary: '#F1F8F7',
    secondary: '#A8C5C6',
    accent: '#5FE7D4',
    inverse: '#00243E',
  },
  border: {
    default: '#16445C',
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
  sm: '0 1px 2px rgba(0, 36, 62, 0.06)',
  md: '0 8px 24px rgba(0, 36, 62, 0.08)',
  lg: '0 20px 48px rgba(0, 36, 62, 0.12)',
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
  layout,
}
