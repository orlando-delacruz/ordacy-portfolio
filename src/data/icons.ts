import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarCheck,
  CircleHelp,
  ClipboardList,
  Clock,
  Code,
  Compass,
  Database,
  Eye,
  FileText,
  FolderKanban,
  Globe,
  Home,
  House,
  Images,
  Inbox,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lightbulb,
  MessageSquareQuote,
  MessagesSquare,
  Package,
  Puzzle,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Target,
  Users,
  UsersRound,
  Wallet,
  Workflow,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import iconNamesJson from '../../data/icons.json'

// JSON can't hold components, so data files store these names. The admin
// icon picker offers exactly this list. data/icons.json is the same list for
// the API validator; the guard below catches drift between the two.
const icons = {
  BarChart3,
  Briefcase,
  Building2,
  CalendarCheck,
  CircleHelp,
  ClipboardList,
  Clock,
  Code,
  Compass,
  Database,
  Eye,
  FileText,
  FolderKanban,
  Globe,
  Home,
  House,
  Images,
  Inbox,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lightbulb,
  MessageSquareQuote,
  MessagesSquare,
  Package,
  Puzzle,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Target,
  Users,
  UsersRound,
  Wallet,
  Workflow,
  Wrench,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof icons

const missingIcons = iconNamesJson.filter((name) => !(name in icons))
if (missingIcons.length > 0) {
  throw new Error(
    `Unknown icon names in data/icons.json: ${missingIcons.join(', ')}`,
  )
}

const unusedIcons = Object.keys(icons).filter(
  (name) => !iconNamesJson.includes(name),
)
if (unusedIcons.length > 0) {
  throw new Error(
    `Icon names missing from data/icons.json: ${unusedIcons.join(', ')}`,
  )
}

export const iconNames = iconNamesJson as IconName[]

export function resolveIcon(name: string): LucideIcon {
  const icon = icons[name as IconName]
  if (!icon) throw new Error(`Unknown icon "${name}" in data/database`)
  return icon
}
