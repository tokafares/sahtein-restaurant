import { ar } from './ar'
import { en } from './en'
import type { Locale, Translations } from '../types/i18n'

export const translations: Record<Locale, Translations> = { ar, en }

export const DEFAULT_LOCALE: Locale = 'ar'
/** Also read by the inline script in index.html to avoid a direction flash */
export const LOCALE_STORAGE_KEY = 'sahtein:lang'

export function isLocale(value: unknown): value is Locale {
  return value === 'ar' || value === 'en'
}
