import { useState } from 'react'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { mobileNavItems } from './navigation'
import * as S from './styles/mobile-bottom-nav.styled'

export function MobileBottomNav() {
  const { hidden, reveal } = useScrollDirection()
  const [focusWithin, setFocusWithin] = useState(false)

  return (
    <S.Nav
      $hidden={hidden && !focusWithin}
      aria-label="Primary navigation"
      onFocusCapture={() => {
        setFocusWithin(true)
        reveal()
      }}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          setFocusWithin(false)
        }
      }}
    >
      {mobileNavItems.map((item) => {
        const Icon = item.mobileIcon

        if (item.to === '/contact') {
          return (
            <S.ContactItem
              key={item.to}
              to={item.to}
              end={item.end}
              aria-label={item.label}
            >
              {({ isActive }) => (
                <Icon
                  size={22}
                  weight={isActive ? 'fill' : 'regular'}
                  aria-hidden="true"
                />
              )}
            </S.ContactItem>
          )
        }

        return (
          <S.Item
            key={item.to}
            to={item.to}
            end={item.end}
            aria-label={item.label}
          >
            {({ isActive }) => (
              <Icon
                size={22}
                weight={isActive ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            )}
          </S.Item>
        )
      })}
    </S.Nav>
  )
}
