import type { Locale } from '../types/i18n'
import type { Formatters } from '../i18n/context'

const intlLocale: Record<Locale, string> = { ar: 'ar-EG', en: 'en-EG' }

export function createFormatters(locale: Locale): Formatters {
  const tag = intlLocale[locale]
  const priceFormat = new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  })
  const numberFormat = new Intl.NumberFormat(tag)
  const dateFormat = new Intl.DateTimeFormat(tag, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
  const weekdayFormat = new Intl.DateTimeFormat(tag, { weekday: 'short', timeZone: 'UTC' })
  const dayFormat = new Intl.DateTimeFormat(tag, { day: 'numeric', timeZone: 'UTC' })
  const monthFormat = new Intl.DateTimeFormat(tag, { month: 'short', timeZone: 'UTC' })
  const timeFormat = new Intl.DateTimeFormat(tag, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  })

  return {
    price: (value) => priceFormat.format(value),
    number: (value) => numberFormat.format(value),
    dateParts: (isoDate) => {
      const parsed = new Date(`${isoDate}T00:00:00Z`)
      return {
        weekday: weekdayFormat.format(parsed),
        day: dayFormat.format(parsed),
        month: monthFormat.format(parsed),
      }
    },
    date: (isoDate) => {
      const parsed = new Date(`${isoDate}T00:00:00Z`)
      return Number.isNaN(parsed.getTime()) ? isoDate : dateFormat.format(parsed)
    },
    time: (value) => {
      // Slots after midnight are stored as "24:30"; wrap them onto the clock face
      const [h, m] = value.split(':').map(Number)
      if (h === undefined || m === undefined || Number.isNaN(h) || Number.isNaN(m)) return value
      return timeFormat.format(new Date(Date.UTC(1970, 0, 1, h % 24, m)))
    },
  }
}
