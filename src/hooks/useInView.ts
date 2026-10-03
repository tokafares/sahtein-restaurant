import { useEffect, useRef, useState } from 'react'

/** Becomes true once the element scrolls into view (then stays true). */
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '0px 0px -10% 0px' }) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const { root, rootMargin, threshold } = options

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { root, rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, root, rootMargin, threshold])

  return { ref, inView }
}
