import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarCheck,
  CircleHelp,
  ClipboardList,
  Clock,
  Code,
  Database,
  Eye,
  FileText,
  FolderKanban,
  Globe,
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
  Wallet,
  Workflow,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// JSON can't hold components, so data files store these names. The admin
// icon picker offers exactly this list.
const icons = {
  BarChart3,
  Briefcase,
  Building2,
  CalendarCheck,
  CircleHelp,
  ClipboardList,
  Clock,
  Code,
  Database,
  Eye,
  FileText,
  FolderKanban,
  Globe,
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
  Wallet,
  Workflow,
  Wrench,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof icons

export const iconNames = Object.keys(icons) as IconName[]

export function resolveIcon(name: string): LucideIcon {
  const icon = icons[name as IconName]
  if (!icon) throw new Error(`Unknown icon "${name}" in data/database`)
  return icon
}
