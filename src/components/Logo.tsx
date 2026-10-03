import { UtensilsCrossed } from 'lucide-react'
import { useI18n } from '../i18n'

interface LogoProps {
  tone?: 'light' | 'dark'
}

export function Logo({ tone = 'dark' }: LogoProps) {
  const { t, locale } = useI18n()
  const light = tone === 'light'
  // Show the brand in both scripts: the current language leads.
  const secondary = locale === 'ar' ? 'Sahtein' : 'صحتين'

  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`grid size-10 place-items-center rounded-xl ${
          light ? 'bg-cream-100 text-olive-800' : 'bg-olive-800 text-cream-100'
        }`}
      >
        <UtensilsCrossed className="size-5" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-xl font-extrabold ${light ? 'text-cream-50' : 'text-olive-900'}`}>{t.brand.name}</span>
        <span
          lang={locale === 'ar' ? 'en' : 'ar'}
          className={`mt-1 text-[0.7rem] font-semibold tracking-wider ${light ? 'text-terracotta-300' : 'text-terracotta-600'}`}
        >
          {secondary}
        </span>
      </span>
    </span>
  )
}
