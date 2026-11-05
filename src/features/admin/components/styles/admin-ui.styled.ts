import styled, { css, keyframes } from 'styled-components'
import {
  PrimaryAction as BasePrimaryAction,
  PrimaryAnchor as BasePrimaryAnchor,
  PrimaryButton as BasePrimaryButton,
  SecondaryAction as BaseSecondaryAction,
  SecondaryButton as BaseSecondaryButton,
  baseStyles,
} from '@/components/ui/styles/buttons.styled'

/* ---------- Buttons: the site's buttons at admin density ---------- */

const dense = css`
  min-height: 2.5rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const PrimaryAction = styled(BasePrimaryAction)`
  ${dense}
`

export const PrimaryAnchor = styled(BasePrimaryAnchor)`
  ${dense}
`

export const PrimaryButton = styled(BasePrimaryButton)`
  ${dense}
`

export const SecondaryAction = styled(BaseSecondaryAction)`
  ${dense}
`

export const SecondaryButton = styled(BaseSecondaryButton)`
  ${dense}
`

/* ---------- Panels ---------- */

// Flat bordered surface: the admin's one container style. No heavy shadows.
export const Panel = styled.section`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const PanelHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const PanelTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const PanelText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

/* ---------- Toolbar ---------- */

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Caption = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
`

export const ToolbarSpacer = styled.span`
  flex: 1;
`

export const Count = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

/* ---------- Compact buttons ---------- */


// Icon-only row action. Always pass aria-label.
export const IconButton = styled.button<{ $danger?: boolean }>`
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors.danger.text : theme.colors.text.secondary};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger.text : theme.colors.text.accent};
    color: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger.text : theme.colors.text.accent};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const DangerAction = styled.button`
  ${baseStyles}
  ${dense}
  border: 1px solid ${({ theme }) => theme.colors.danger.text};
  background: ${({ theme }) => theme.colors.danger.text};
  color: ${({ theme }) => theme.colors.background.default};
  font-family: inherit;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.danger.text} 88%,
      ${({ theme }) => theme.colors.text.primary}
    );
  }

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

/* ---------- Table ---------- */

// Below md, rows become stacked cards; each cell shows its column label
// from data-label.
export const TableWrap = styled.div`
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    overflow-x: auto;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.surface.default};
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-align: left;

  thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  tbody {
    display: grid;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  tr {
    display: grid;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.surface.default};
  }

  td {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    min-width: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    overflow-wrap: anywhere;

    &[data-label]::before {
      min-width: 6.5rem;
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${({ theme }) => theme.typography.fontSizes.xs};
      font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
      letter-spacing: 0.04em;
      text-transform: uppercase;
      content: attr(data-label);
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    thead {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: table-header-group;
    }

    tbody {
      display: table-row-group;
    }

    tr {
      display: table-row;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
    }

    th,
    td {
      display: table-cell;
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
      border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
      vertical-align: middle;

      &[data-label]::before {
        content: none;
      }
    }

    tbody tr:last-child > * {
      border-bottom: 0;
    }

    tbody tr:hover {
      background: ${({ theme }) => theme.colors.surface.subtle};
    }

    th {
      background: ${({ theme }) => theme.colors.background.subtle};
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${({ theme }) => theme.typography.fontSizes.xs};
      font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
      letter-spacing: 0.04em;
      text-transform: uppercase;
      white-space: nowrap;
    }
  }
`

export const CellStrong = styled.span`
  display: grid;
  gap: 0.125rem;
  min-width: 0;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  span {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  }
`

export const Muted = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`

export const RowActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: nowrap;
    justify-content: flex-end;
  }
`

/* ---------- Badges ---------- */

export type Tone = 'info' | 'warning' | 'success' | 'neutral' | 'danger'

export const Badge = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $tone, theme }) =>
    `color-mix(in srgb, ${$tone === 'danger' ? theme.colors.danger.text : theme.colors.status[$tone]} 14%, transparent)`};
  color: ${({ $tone, theme }) =>
    $tone === 'danger' ? theme.colors.danger.text : theme.colors.status[$tone]};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  white-space: nowrap;

  &::before {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: ${({ theme }) => theme.radii.round};
    background: currentColor;
    content: '';
  }
`

/* ---------- Record lists (ordered content) ---------- */

export const RecordList = styled.ol`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const RecordItem = styled.li<{ $hidden?: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};

  &:last-child {
    border-bottom: 0;
  }

  & > :last-child {
    grid-column: 1 / -1;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: auto minmax(0, 1fr) auto;

    & > :last-child {
      grid-column: auto;
    }
  }

  ${({ $hidden }) =>
    $hidden &&
    css`
      background: ${({ theme }) => theme.colors.surface.subtle};
    `}
`

export const RecordIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const RecordBody = styled.div`
  display: grid;
  gap: 0.25rem;
  min-width: 0;

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  }
`

export const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`

/* ---------- Notices ---------- */

export const Notice = styled.p<{ $tone?: 'info' | 'warning' }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $tone = 'info', theme }) =>
      `color-mix(in srgb, ${theme.colors.status[$tone]} 40%, transparent)`};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $tone = 'info', theme }) =>
    `color-mix(in srgb, ${theme.colors.status[$tone]} 8%, transparent)`};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};

  svg {
    flex: none;
    margin-top: 0.125rem;
    color: ${({ $tone = 'info', theme }) => theme.colors.status[$tone]};
  }
`

/* ---------- Loading / empty ---------- */

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const StateBox = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }

  p {
    max-width: 32rem;
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }

  svg[data-spin] {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${spin} 900ms linear infinite;
    }
  }
`

/* ---------- Dialog body ---------- */

// Lightbox already pads and centers its body; fill its width instead.
export const DialogBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  min-width: 0;
`

export const DialogActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const DefinitionList = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  div {
    display: grid;
    gap: 0.25rem;
  }

  [data-wide] {
    grid-column: 1 / -1;
  }

  dt {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  a {
    color: ${({ theme }) => theme.colors.text.accent};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }
`

export const Code = styled.pre`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`
