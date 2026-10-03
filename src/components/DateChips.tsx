import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRovingRadio } from '../hooks/useRovingRadio'
import { useI18n } from '../i18n'
import { toIsoDate } from '../lib/schedule'

interface DateChipsProps {
  id: string
  labelId: string
  dates: readonly string[]
  value: string
  onChange: (iso: string) => void
  invalid?: boolean
  describedBy?: string
}

/** Horizontally scrollable, fully localized date picker built as a radio group. */
export function DateChips({ id, labelId, dates, value, onChange, invalid, describedBy }: DateChipsProps) {
  const { t, fmt, dir } = useI18n()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })
  const { getOptionProps } = useRovingRadio(dates, value, onChange, dir)

  // In RTL, scrollLeft runs from 0 toward negative values, so compare magnitudes
  const updateEdges = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const offset = Math.abs(el.scrollLeft)
    setEdges({ atStart: offset <= 2, atEnd: offset >= el.scrollWidth - el.clientWidth - 2 })
  }, [])

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [updateEdges, dir])

  /** Scroll toward inline-start (-1) or inline-end (+1) */
  const page = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const physical = dir === 'rtl' ? -direction : direction
    el.scrollBy({ left: physical * el.clientWidth * 0.75, behavior: 'smooth' })
  }

  const now = new Date()
  const todayIso = toIsoDate(now)
  const tomorrowIso = toIsoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))
  const label = (iso: string) =>
    iso === todayIso
      ? t.reservation.datePicker.today
      : iso === tomorrowIso
        ? t.reservation.datePicker.tomorrow
        : fmt.dateParts(iso).weekday

  const arrowClass =
    'absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-cream-50 text-olive-900 shadow-card ring-1 ring-sand-300 transition hover:bg-cream-200 disabled:pointer-events-none disabled:opacity-0 sm:grid'

  return (
    <div className="relative">
      <button
        type="button"
        tabIndex={-1}
        onClick={() => page(-1)}
        disabled={edges.atStart}
        aria-label={t.reservation.datePicker.earlier}
        className={`${arrowClass} -start-3`}
      >
        <ChevronLeft aria-hidden="true" className="size-5 rtl:-scale-x-100" />
      </button>
      <div
        ref={scrollerRef}
        id={id}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onScroll={updateEdges}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-2 overflow-x-auto px-6 py-1 sm:mx-0 sm:scroll-px-1 sm:px-1"
      >
        {dates.map((iso, index) => {
          const parts = fmt.dateParts(iso)
          const selected = iso === value
          return (
            <button
              key={iso}
              {...getOptionProps(iso, index)}
              aria-label={fmt.date(iso)}
              className={`flex w-[4.75rem] shrink-0 snap-start flex-col items-center rounded-2xl border px-2 py-2.5 transition ${
                selected
                  ? 'border-olive-800 bg-olive-800 text-cream-50 shadow-card'
                  : `bg-cream-50 text-ink-900 hover:border-olive-700 ${invalid ? 'border-terracotta-500' : 'border-sand-300'}`
              }`}
            >
              <span className={`text-xs font-semibold ${selected ? 'text-olive-200' : 'text-ink-500'}`}>{label(iso)}</span>
              <span className="text-2xl leading-tight font-extrabold">{parts.day}</span>
              <span className={`text-xs font-medium ${selected ? 'text-cream-200' : 'text-ink-500'}`}>{parts.month}</span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        tabIndex={-1}
        onClick={() => page(1)}
        disabled={edges.atEnd}
        aria-label={t.reservation.datePicker.later}
        className={`${arrowClass} -end-3`}
      >
        <ChevronRight aria-hidden="true" className="size-5 rtl:-scale-x-100" />
      </button>
    </div>
  )
}
