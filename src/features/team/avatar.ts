import type { TeamMember } from '@/data'
import type { ThemeName } from '@/styles/theme'

/** Theme-appropriate profile photo; older records without darkSrc use src. */
export function teamAvatarSrc(
  avatar: TeamMember['avatar'],
  theme: ThemeName,
): string | undefined {
  if (!avatar) return undefined
  return theme === 'dark' && avatar.darkSrc ? avatar.darkSrc : avatar.src
}
