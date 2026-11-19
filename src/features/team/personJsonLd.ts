import { site } from '@/data'
import type { TeamMember } from '@/data'

/** Person JSON-LD built only from confirmed member fields. */
export function personJsonLd(member: TeamMember) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    description: member.headline,
    worksFor: {
      '@type': 'Organization',
      name: site.name,
      ...(site.siteUrlPending ? {} : { url: site.siteUrl }),
    },
    knowsAbout:
      member.skillGroups && member.skillGroups.length > 0
        ? member.skillGroups.flatMap((group) => [...group.items])
        : member.skills.length > 0
          ? [...member.skills]
          : undefined,
    alumniOf: member.education.map((entry) => entry.school),
    ...(member.avatar ? { image: member.avatar.src } : {}),
  }
}
