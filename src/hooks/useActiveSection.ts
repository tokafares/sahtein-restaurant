import { useEffect, useState } from 'react'

/** Returns the id of the section currently crossing the middle band of the viewport. */
export function useActiveSection<T extends string>(ids: readonly T[]): T | null {
  const [active, setActive] = useState<T | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = ids.find((id) => id === entry.target.id)
            if (match) setActive(match)
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
