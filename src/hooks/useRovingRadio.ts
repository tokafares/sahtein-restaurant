import { useCallback, useRef, type KeyboardEvent } from 'react'

/**
 * WAI-ARIA radio group with roving tabindex for custom (non-input) options.
 * Arrow keys select and focus the next/previous option. Left and Right follow
 * the reading direction, so in RTL ArrowLeft moves forward. Home and End jump to the ends.
 */
export function useRovingRadio<T extends string>(
  options: readonly T[],
  value: string,
  onChange: (value: T) => void,
  dir: 'rtl' | 'ltr',
) {
  const nodes = useRef(new Map<T, HTMLButtonElement>())
  const selectedIndex = options.findIndex((option) => option === value)
  // Only one option is tabbable: the selected one, or the first if none is selected
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex

  const select = useCallback(
    (index: number) => {
      const option = options[index]
      if (option === undefined) return
      onChange(option)
      const node = nodes.current.get(option)
      node?.focus()
      node?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    },
    [options, onChange],
  )

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    const last = options.length - 1
    let next: number | null = null
    if (event.key === forward || event.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (event.key === backward || event.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    select(next)
  }

  const getOptionProps = (option: T, index: number) => ({
    ref: (node: HTMLButtonElement | null) => {
      if (node) nodes.current.set(option, node)
      else nodes.current.delete(option)
    },
    type: 'button' as const,
    role: 'radio' as const,
    'aria-checked': index === selectedIndex,
    tabIndex: index === tabbableIndex ? 0 : -1,
    onClick: () => select(index),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => onKeyDown(event, index),
  })

  /** Focus the tabbable option, e.g. when validation sends focus to this group */
  const focus = () => {
    const option = options[tabbableIndex]
    if (option !== undefined) nodes.current.get(option)?.focus()
  }

  return { getOptionProps, focus }
}
