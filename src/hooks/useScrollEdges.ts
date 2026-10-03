import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

const FADE = '28px'

/**
 * Tracks whether a horizontal scroller is at its inline start/end and returns a
 * matching mask that fades whichever edges still have content beyond them.
 * In RTL, scrollLeft runs from 0 toward negative values, so magnitudes are compared.
 */
export function useScrollEdges<T extends HTMLElement>(dir: 'rtl' | 'ltr') {
  const ref = useRef<T>(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: true })

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const offset = Math.abs(el.scrollLeft)
    const max = el.scrollWidth - el.clientWidth
    setEdges({ atStart: offset <= 2, atEnd: offset >= max - 2 })
  }, [])

  useEffect(() => {
    update()
    const el = ref.current
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    if (el) observer?.observe(el)
    window.addEventListener('resize', update)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [update, dir])

  const endSide = dir === 'rtl' ? 'left' : 'right'
  const gradient = `linear-gradient(to ${endSide}, ${edges.atStart ? '#000' : 'transparent'} 0, #000 ${FADE}, #000 calc(100% - ${FADE}), ${
    edges.atEnd ? '#000' : 'transparent'
  } 100%)`
  const fadeStyle: CSSProperties = edges.atStart && edges.atEnd ? {} : { maskImage: gradient, WebkitMaskImage: gradient }

  return { ref, edges, update, fadeStyle }
}
