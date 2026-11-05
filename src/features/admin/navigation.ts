import { resolveIcon, seed } from '@/data'

/** Admin sidebar groups from data/database/admin-navigation.json, icons resolved. */
export const adminNavGroups = seed.adminNavigation.map((group) => ({
  ...group,
  items: group.items.map((item) => ({
    ...item,
    Icon: resolveIcon(item.icon),
  })),
}))

const allItems = adminNavGroups.flatMap((group) => group.items)

export function findAdminNavItem(id: string) {
  const item = allItems.find((entry) => entry.id === id)
  if (!item) throw new Error(`Unknown admin nav id "${id}"`)
  return item
}

/** The nav entry for a pathname (longest matching path wins). */
export const navItemForPath = (pathname: string) =>
  [...allItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) =>
      item.path === '/admin'
        ? pathname === '/admin' || pathname === '/admin/'
        : pathname.startsWith(item.path),
    )
