import { Moon } from 'lucide-react'
import { useRovingRadio } from '../hooks/useRovingRadio'
import { useI18n } from '../i18n'
import { toMinutes } from '../lib/schedule'

interface TimeSlotsProps {
  id: string
  labelId: string
  slots: readonly string[]
  value: string
  onChange: (time: string) => void
  invalid?: boolean
  describedBy?: string
}

/** Grid of localized 30-minute slots, built as a radio group. */
export function TimeSlots({ id, labelId, slots, value, onChange, invalid, describedBy }: TimeSlotsProps) {
  const { t, fmt, dir } = useI18n()
  const { getOptionProps } = useRovingRadio(slots, value, onChange, dir)

  return (
    <div
      id={id}
      role="radiogroup"
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6"
    >
      {slots.map((slot, index) => {
        const selected = slot === value
        const afterMidnight = toMinutes(slot) >= 24 * 60
        const label = fmt.time(slot)
        return (
          <button
            key={slot}
            {...getOptionProps(slot, index)}
            aria-label={afterMidnight ? `${label} (${t.reservation.timePicker.afterMidnight})` : label}
            className={`relative h-11 rounded-xl border text-sm font-semibold whitespace-nowrap tabular-nums transition ${
              selected
                ? 'border-olive-800 bg-olive-800 text-cream-50 shadow-card'
                : `bg-cream-50 text-ink-900 hover:border-olive-700 ${invalid ? 'border-terracotta-500' : 'border-sand-300'}`
            }`}
          >
            {label}
            {afterMidnight && (
              <Moon
                aria-hidden="true"
                className={`absolute end-1.5 top-1.5 size-3 ${selected ? 'text-olive-200' : 'text-ink-500'}`}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
