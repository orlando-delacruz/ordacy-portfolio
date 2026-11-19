import type { LegalDocument } from '@/data'

/** Estimated reading time from the document title, intro, and body. */
export function readingTime(document: LegalDocument): string {
  const words = [
    document.title,
    document.intro,
    ...document.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.items ?? []),
    ]),
  ]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return `${Math.max(1, Math.ceil(words / 200))} min read`
}
