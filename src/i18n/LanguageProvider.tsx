import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18nContextValue } from './context'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, isLocale, translations } from './translations'
import { createFormatters } from '../lib/format'
import { readStorage, writeStorage } from '../lib/storage'
import type { Locale } from '../types/i18n'

function initialLocale(): Locale {
  const stored = readStorage(LOCALE_STORAGE_KEY)
  return isLocale(stored) ? stored : DEFAULT_LOCALE
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const t = translations[locale]
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const html = document.documentElement
    html.lang = locale
    html.dir = dir
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    writeStorage(LOCALE_STORAGE_KEY, locale)
  }, [locale, dir, t])

  const toggleLocale = useCallback(() => setLocale((current) => (current === 'ar' ? 'en' : 'ar')), [])

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir, t, fmt: createFormatters(locale), setLocale, toggleLocale }),
    [locale, dir, t, toggleLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
