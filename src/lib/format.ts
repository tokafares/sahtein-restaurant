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
  const timeFormat = new Intl.DateTimeFormat(tag, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  })

  return {
    price: (value) => priceFormat.format(value),
    number: (value) => numberFormat.format(value),
    date: (isoDate) => {
      const parsed = new Date(`${isoDate}T00:00:00Z`)
      return Number.isNaN(parsed.getTime()) ? isoDate : dateFormat.format(parsed)
    },
    time: (value) => {
      const parsed = new Date(`1970-01-01T${value}:00Z`)
      return Number.isNaN(parsed.getTime()) ? value : timeFormat.format(parsed)
    },
  }
}
