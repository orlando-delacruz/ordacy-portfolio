import {
  ChatsCircleIcon,
  CurrencyCircleDollarIcon,
  FolderSimpleIcon,
  HouseIcon,
  PhoneIcon,
} from '@phosphor-icons/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  CircleDollarSign,
  FolderKanban,
  House,
  Info,
  Menu,
  MessagesSquare,
  Phone,
  ScrollText,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavigationItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

export type MobileNavigationItem = NavigationItem & {
  mobileIcon: PhosphorIcon
  /** Shorter visible label for the bottom bar, where each slot is ~1/5 of a phone width. */
  mobileLabel?: string
}

const home = {
  label: 'Home',
  to: '/',
  icon: House,
  end: true,
} satisfies NavigationItem

const projects = {
  label: 'Projects',
  to: '/projects',
  icon: FolderKanban,
} satisfies NavigationItem

const pricing = {
  label: 'Pricing',
  to: '/pricing',
  icon: CircleDollarSign,
} satisfies NavigationItem

const contact = {
  label: 'Contact',
  to: '/contact',
  icon: Phone,
} satisfies NavigationItem

const testimonials = {
  label: 'Testimonials',
  to: '/testimonials',
  icon: MessagesSquare,
} satisfies NavigationItem

const about = {
  label: 'About Us',
  to: '/about-us',
  icon: Info,
} satisfies NavigationItem

const privacy = {
  label: 'Privacy Policy',
  to: '/privacy-policy',
  icon: ShieldCheck,
} satisfies NavigationItem

const terms = {
  label: 'Terms and Conditions',
  to: '/terms-of-service',
  icon: ScrollText,
} satisfies NavigationItem

export const primaryNavItems: readonly NavigationItem[] = [
  home,
  projects,
  testimonials,
  pricing,
  contact,
]

export const mobileNavItems: readonly MobileNavigationItem[] = [
  { ...home, mobileIcon: HouseIcon },
  { ...projects, mobileIcon: FolderSimpleIcon },
  { ...contact, mobileIcon: PhoneIcon },
  { ...pricing, mobileIcon: CurrencyCircleDollarIcon },
  { ...testimonials, mobileIcon: ChatsCircleIcon, mobileLabel: 'Reviews' },
]

export const secondaryNavItems: readonly NavigationItem[] = [
  about,
  privacy,
  terms,
]

export const allNavItems: readonly NavigationItem[] = [
  ...primaryNavItems,
  ...secondaryNavItems,
]

export const moreNavItem = {
  label: 'More',
  icon: Menu,
} satisfies Pick<NavigationItem, 'label' | 'icon'>

export function getPageTitle(pathname: string) {
  const normalized =
    pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname

  return (
    allNavItems.find((item) => item.to === normalized)?.label ??
    'Page not found'
  )
}

export const sidebarWidths = {
  expanded: '16.5rem',
  collapsed: '5.25rem',
} as const
