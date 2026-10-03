import { ArrowDown, CalendarCheck, Flame, Leaf, UtensilsCrossed, Wheat } from 'lucide-react'
import { images } from '../data/site'
import { useI18n } from '../i18n'
import { unsplash, unsplashSrcSet } from '../lib/unsplash'

const highlightIcons = [Flame, Wheat, Leaf] as const

export function Hero() {
  const { t } = useI18n()

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-olive-950">
      <img
        src={unsplash(images.hero, 1600)}
        srcSet={unsplashSrcSet(images.hero, [640, 960, 1280, 1600, 2000])}
        sizes="100vw"
        alt={t.hero.imageAlt}
        width={1600}
        height={1067}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      {/* Readability overlay: darker toward the text side, works for both directions */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-olive-950/95 via-olive-950/60 to-olive-950/30 md:ltr:bg-linear-to-r md:rtl:bg-linear-to-l md:from-olive-950/95 md:via-olive-950/70 md:to-olive-950/10"
      />

      <div className="container-page flex min-h-[calc(100svh-4.5rem)] flex-col justify-end py-14 sm:py-20 md:justify-center">
        <div className="max-w-2xl animate-fade-in">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cream-100/25 bg-cream-50/10 px-4 py-1.5 text-sm font-semibold text-cream-100 backdrop-blur">
            <UtensilsCrossed aria-hidden="true" className="size-4 text-terracotta-300" />
            {t.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="text-4xl leading-[1.15] font-extrabold text-cream-50 text-balance sm:text-5xl lg:text-6xl">
            {t.hero.title} <span className="text-terracotta-300">{t.hero.titleAccent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-200 text-pretty sm:text-lg">{t.hero.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#menu"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-terracotta-600 px-7 font-bold text-cream-50 shadow-lift transition hover:-translate-y-0.5 hover:bg-terracotta-700"
            >
              {t.hero.viewMenu}
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
            <a
              href="#reservation"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-cream-100/70 px-7 font-bold text-cream-50 transition hover:-translate-y-0.5 hover:bg-cream-50 hover:text-olive-900"
            >
              <CalendarCheck aria-hidden="true" className="size-4" />
              {t.hero.bookTable}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-cream-100">
            {t.hero.highlights.map((label, index) => {
              const Icon = highlightIcons[index] ?? Flame
              return (
                <li key={label} className="inline-flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-cream-50/10">
                    <Icon aria-hidden="true" className="size-4 text-terracotta-300" />
                  </span>
                  {label}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
