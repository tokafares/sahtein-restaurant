import { ChefHat, Flame, Leaf, type LucideIcon } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { images } from '../data/site'
import { useI18n } from '../i18n'
import { unsplash, unsplashSrcSet } from '../lib/unsplash'
import type { FeatureId } from '../types/i18n'

const features: readonly { id: FeatureId; icon: LucideIcon }[] = [
  { id: 'recipes', icon: ChefHat },
  { id: 'fresh', icon: Leaf },
  { id: 'grill', icon: Flame },
]

export function About() {
  const { t } = useI18n()

  return (
    <section id="about" aria-labelledby="about-title" className="bg-pattern py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src={unsplash(images.about, 900, 1000)}
              srcSet={unsplashSrcSet(images.about, [480, 720, 900, 1200], 0.9)}
              sizes="(min-width: 64rem) 50vw, 100vw"
              alt={t.about.imageAlt}
              width={900}
              height={1000}
              loading="lazy"
              decoding="async"
              className="aspect-[9/10] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 end-4 rounded-2xl bg-olive-800 px-6 py-4 text-cream-50 shadow-lift sm:end-8">
            <p className="text-sm font-medium text-olive-200">{t.about.since}</p>
            <p className="text-3xl font-extrabold">{t.about.sinceYear}</p>
          </div>
        </Reveal>

        <div>
          <SectionHeading id="about-title" eyebrow={t.about.eyebrow} title={t.about.title} align="start" />
          <Reveal delay={100} className="mt-6 space-y-4 text-base leading-relaxed text-ink-700 sm:text-lg">
            {t.about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </div>

      <ul className="container-page mt-20 grid gap-5 md:grid-cols-3">
        {features.map(({ id, icon: Icon }, index) => (
          <Reveal as="li" key={id} delay={index * 120}>
            <div className="group h-full rounded-3xl border border-sand-300/60 bg-cream-50 p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="grid size-14 place-items-center rounded-2xl bg-terracotta-100 text-terracotta-600 transition duration-300 group-hover:bg-terracotta-600 group-hover:text-cream-50">
                <Icon aria-hidden="true" className="size-7" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-olive-900">{t.about.features[id].title}</h3>
              <p className="mt-2 leading-relaxed text-ink-500">{t.about.features[id].text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
