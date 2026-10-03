import { Languages } from 'lucide-react'
import { useI18n } from '../i18n'

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { t, locale, toggleLocale } = useI18n()

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.a11y.switchLanguage}
      className={`inline-flex h-10 items-center gap-1.5 rounded-full border border-olive-800/20 px-3.5 text-sm font-bold text-olive-900 transition hover:border-olive-800/40 hover:bg-olive-800/5 ${className}`}
    >
      <Languages aria-hidden="true" className="size-4" />
      <span lang={locale === 'ar' ? 'en' : 'ar'}>{t.language.switchTo}</span>
    </button>
  )
}
