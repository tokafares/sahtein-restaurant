import { createContext } from 'react'
import type { Locale, Translations } from '../types/i18n'

export interface Formatters {
  /** Price in EGP, e.g. "EGP 120" or "١٢٠ ج.م." */
  price: (value: number) => string
  /** Plain number with locale digits */
  number: (value: number) => string
  /** ISO date (yyyy-mm-dd) to a readable long date */
  date: (isoDate: string) => string
  /** ISO date split into short localized parts for date chips */
  dateParts: (isoDate: string) => { weekday: string; day: string; month: string }
  /** "HH:mm" (hours may exceed 23 for after-midnight slots) to a locale time string */
  time: (value: string) => string
}

export interface I18nContextValue {
  locale: Locale
  dir: 'rtl' | 'ltr'
  t: Translations
  fmt: Formatters
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

export const I18nContext = createContext<I18nContextValue | null>(null)
