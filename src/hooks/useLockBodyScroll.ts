import { useEffect } from 'react'

let locks = 0

/** Prevents page scroll while `active` is true. Supports nested overlays. */
export function useLockBodyScroll(active: boolean): void {
  useEffect(() => {
    if (!active) return
    locks += 1
    const { style } = document.body
    const previous = style.overflow
    style.overflow = 'hidden'
    return () => {
      locks -= 1
      if (locks === 0) style.overflow = previous
    }
  }, [active])
}
