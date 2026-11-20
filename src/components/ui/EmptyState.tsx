import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { StatePanel } from '@/components/state/StatePanel'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  children?: ReactNode
}

/**
 * Compatibility wrapper for local no-result blocks (FAQ search and filters).
 * Page-level empty states belong to `PageState`, not this component.
 */
export function EmptyState({
  icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <StatePanel
      tone="empty"
      icon={icon}
      title={title}
      description={description}
      actions={children}
    />
  )
}
