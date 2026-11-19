// Grid conformance check: spacing and fixed sizes follow the 4/8-point
// system (see AGENTS.md "Spacing and sizing"). Run with `npm run check:grid`.
// No dependencies; plain Node.
//
// A finding prints as: file:line  <px value>  <suggestion>  <snippet>
// Lines carrying a `grid-exempt` comment are skipped by design.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const STYLE_FILES = []
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
      continue
    }
    if (/\.styled\.(ts|tsx)$/.test(entry) || entry === 'GlobalStyles.ts') {
      STYLE_FILES.push(full)
    }
  }
}
walk(join(ROOT, 'src', 'components'))
walk(join(ROOT, 'src', 'features'))
walk(join(ROOT, 'src', 'styles'))

const SPACING_PROPS =
  /^(?:padding|margin|gap|top|right|bottom|left|inset|width|height|min-width|min-height|max-width|max-height|row-gap|column-gap|scroll-margin-top|scroll-padding(?:-inline|-block)?|border-width|outline-offset)\s*:/

const SKIP_VALUE = /%|calc\(|clamp\(|min\(|max\(|var\(--|vw|vh|svw|svh|dvw|dvh|ch\b|auto|inherit|none|transparent|currentColor|url\(|gradient/

// Nearest on-grid step for a pixel value (multiples of 4, preferring 8).
function nearest(px) {
  const steps = [4, 8, 12, 16, 24, 32, 40, 48, 64, 96]
  let best = steps[0]
  for (const step of steps) {
    if (Math.abs(step - px) < Math.abs(best - px)) best = step
  }
  return best
}

const findings = []

function checkFile(file) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, index) => {
    if (line.includes('grid-exempt')) return
    const trimmed = line.trim()
    if (!SPACING_PROPS.test(trimmed)) return
    const declaration = trimmed.slice(trimmed.indexOf(':') + 1)
    if (SKIP_VALUE.test(declaration)) return
    for (const match of declaration.matchAll(/(-?\d*\.?\d+)(px|r?em)/g)) {
      const raw = parseFloat(match[1])
      const px = match[2] === 'px' ? raw : raw * 16
      if (px < 4) continue // Hairlines and sub-pixel nudges are exempt.
      if (px % 4 === 0) continue
      findings.push({
        file: relative(ROOT, file),
        line: index + 1,
        px,
        suggestion: nearest(px),
        snippet: trimmed.slice(0, 100),
      })
    }
  })
}

for (const file of STYLE_FILES) checkFile(file)

// Theme tokens themselves must be on-grid.
{
  const theme = readFileSync(join(ROOT, 'src', 'styles', 'theme.ts'), 'utf8')
  const spacing = theme.match(/const spacing = \{[^}]*\}/s)?.[0] ?? ''
  for (const match of spacing.matchAll(/'(-?\d*\.?\d+)rem'/g)) {
    const px = parseFloat(match[1]) * 16
    if (px >= 4 && px % 4 !== 0) {
      findings.push({
        file: 'src/styles/theme.ts',
        line: 0,
        px,
        suggestion: nearest(px),
        snippet: 'spacing token',
      })
    }
  }
  const radii = theme.match(/const radii = \{[^}]*\}/s)?.[0] ?? ''
  for (const match of radii.matchAll(/'(-?\d*\.?\d+)rem'/g)) {
    const px = parseFloat(match[1]) * 16
    if (px >= 4 && px % 4 !== 0) {
      findings.push({
        file: 'src/styles/theme.ts',
        line: 0,
        px,
        suggestion: nearest(px),
        snippet: 'radii token',
      })
    }
  }
}

// JSX icon sizes: multiples of 4, with 14 and 18 approved as optical sizes.
{
  const tsxFiles = []
  function walkTsx(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        walkTsx(full)
        continue
      }
      if (/\.(ts|tsx)$/.test(entry)) tsxFiles.push(full)
    }
  }
  walkTsx(join(ROOT, 'src'))
  for (const file of tsxFiles) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, index) => {
      if (line.includes('grid-exempt')) return
      for (const match of line.matchAll(/size=\{(\d+)\}/g)) {
        const n = Number(match[1])
        if (n % 4 === 0 || n === 14 || n === 18) continue
        findings.push({
          file: relative(ROOT, file),
          line: index + 1,
          px: n,
          suggestion: nearest(n),
          snippet: line.trim().slice(0, 100),
        })
      }
    })
  }
}

if (findings.length === 0) {
  console.log('check:grid — all spacing, radii, and icon sizes are on-grid.')
} else {
  for (const finding of findings) {
    console.log(
      `${finding.file}:${finding.line}  ${finding.px}px → try ${finding.suggestion}px  ${finding.snippet}`,
    )
  }
  console.log(`\ncheck:grid — ${findings.length} off-grid value(s).`)
  process.exitCode = 1
}
