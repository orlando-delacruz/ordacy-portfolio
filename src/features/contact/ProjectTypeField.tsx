import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import * as S from './styles/contact.styled'

export type ProjectTypeOption = {
  value: string
  label: string
  icon: LucideIcon
}

type ProjectTypeFieldProps = {
  id: string
  name: string
  label: string
  optional?: boolean
  icon: LucideIcon
  options: readonly ProjectTypeOption[]
}

/**
 * Custom listbox for the project type, styled like the Projects category
 * filter: a branded trigger and a menu with a tile icon per service. The
 * value still submits through a hidden input, so the form code is unchanged.
 */
export function ProjectTypeField({
  id,
  name,
  label,
  optional,
  icon: Icon,
  options,
}: ProjectTypeFieldProps) {
  const [selected, setSelected] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const focusOnOpen = useRef(false)

  const selectedOption =
    options.find((option) => option.value === selected) ?? options[0]
  const labelId = `${id}-label`
  const valueId = `${id}-value`
  const menuId = `${id}-menu`

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open || !focusOnOpen.current) return
    focusOnOpen.current = false
    optionRefs.current[activeIndex]?.focus()
  }, [open, activeIndex])

  const openMenu = (index = activeIndex) => {
    const target = Math.min(Math.max(index, 0), options.length - 1)
    setActiveIndex(target)
    focusOnOpen.current = true
    setOpen(true)
  }

  const closeMenu = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const choose = (value: string) => {
    setSelected(value)
    closeMenu()
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const current = options.findIndex(
        (option) => option.value === selected,
      )
      openMenu(
        event.key === 'ArrowDown'
          ? Math.max(current, 0)
          : current > 0
            ? current
            : options.length - 1,
      )
    }
  }

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = options.length - 1
    let next: number | null = null

    if (event.key === 'ArrowDown') next = (activeIndex + 1) % options.length
    else if (event.key === 'ArrowUp') {
      next = (activeIndex - 1 + options.length) % options.length
    } else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = lastIndex
    else if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
    } else if (event.key === 'Tab') {
      setOpen(false)
    }

    if (next === null) return
    event.preventDefault()
    setActiveIndex(next)
    optionRefs.current[next]?.focus()
  }

  return (
    <S.Field ref={rootRef}>
      <S.Label as="span" id={labelId}>
        {label}
        {optional && <S.Optional>(optional)</S.Optional>}
      </S.Label>
      <S.Control>
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
        <S.PickerTrigger
          ref={triggerRef}
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          aria-labelledby={`${labelId} ${valueId}`}
          onClick={() =>
            open
              ? closeMenu()
              : openMenu(
                  options.findIndex((option) => option.value === selected),
                )
          }
          onKeyDown={onTriggerKeyDown}
        >
          <S.PickerValue id={valueId} $placeholder={selected === ''}>
            {selectedOption?.label}
          </S.PickerValue>
          <S.PickerChevron $open={open} aria-hidden="true">
            <ChevronDown size={18} strokeWidth={2} />
          </S.PickerChevron>
        </S.PickerTrigger>
        {open && (
          <S.PickerMenu
            id={menuId}
            role="listbox"
            aria-labelledby={labelId}
            onKeyDown={onMenuKeyDown}
          >
            {options.map((option, index) => {
              const Icon = option.icon
              const isSelected = option.value === selected

              return (
                <S.PickerOption
                  key={option.value || 'not-sure'}
                  ref={(element) => {
                    optionRefs.current[index] = element
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  $selected={isSelected}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => choose(option.value)}
                >
                  <S.PickerOptionIcon aria-hidden="true">
                    <Icon size={18} strokeWidth={2} />
                  </S.PickerOptionIcon>
                  <S.PickerOptionLabel>{option.label}</S.PickerOptionLabel>
                </S.PickerOption>
              )
            })}
          </S.PickerMenu>
        )}
        <input type="hidden" name={name} value={selected} />
      </S.Control>
    </S.Field>
  )
}
