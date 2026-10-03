import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useI18n } from '../i18n'
import { unsplash } from '../lib/unsplash'
import type { GalleryImage } from '../types/gallery'

interface LightboxProps {
  images: readonly GalleryImage[]
  index: number | null
  onChange: (index: number) => void
  onClose: () => void
}

export function Lightbox({ images, index, onChange, onClose }: LightboxProps) {
  const { t, fmt, dir } = useI18n()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null
  const current = index === null ? undefined : images[index]
  const total = images.length

  useLockBodyScroll(open)

  const go = useCallback(
    (step: 1 | -1) => {
      if (index === null) return
      onChange((index + step + total) % total)
    },
    [index, onChange, total],
  )

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      // Arrow keys follow visual direction: in RTL, ArrowLeft goes to the next image.
      const nextKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      const prevKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      if (event.key === 'Escape') onClose()
      else if (event.key === nextKey) go(1)
      else if (event.key === prevKey) go(-1)
      else if (event.key === 'Tab') {
        // Keep focus inside the dialog
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dir, go, onClose])

  if (!current || index === null) return null
  const alt = t.gallery.images[current.id]

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.gallery.dialogLabel}
      className="fixed inset-0 z-[60] flex animate-fade-in flex-col bg-olive-950/95 backdrop-blur"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex items-center justify-between p-4 text-cream-100">
        <p className="text-sm font-semibold" aria-live="polite">
          {t.gallery.counter(fmt.number(index + 1), fmt.number(total))}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.gallery.close}
          className="grid size-11 place-items-center rounded-full bg-cream-50/10 transition hover:bg-cream-50/20"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <figure key={current.id} className="flex max-h-full animate-fade-in flex-col items-center">
          <img
            src={unsplash(current.image, 1600)}
            alt={alt}
            decoding="async"
            className="max-h-[calc(100svh-10rem)] w-auto max-w-full rounded-2xl object-contain shadow-lift"
          />
          <figcaption className="mt-3 max-w-xl text-center text-sm text-cream-200">{alt}</figcaption>
        </figure>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={t.gallery.previous}
          className="absolute start-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-cream-50/15 text-cream-50 transition hover:bg-cream-50/30 sm:start-4"
        >
          <ChevronLeft aria-hidden="true" className="size-7 rtl:-scale-x-100" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={t.gallery.next}
          className="absolute end-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-cream-50/15 text-cream-50 transition hover:bg-cream-50/30 sm:end-4"
        >
          <ChevronRight aria-hidden="true" className="size-7 rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  )
}
