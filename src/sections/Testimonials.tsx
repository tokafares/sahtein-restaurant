import { Quote, Star } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { testimonials } from '../data/testimonials'
import { useI18n } from '../i18n'

// Arabic letters join, so two initials read as a word; use one there.
function initials(name: string, count: number): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, count)
    .map((part) => part.charAt(0))
    .join('')
}

const avatarColors = ['bg-terracotta-500', 'bg-olive-700', 'bg-saffron-500'] as const

export function Testimonials() {
  const { t, fmt, locale } = useI18n()

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-pattern py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="testimonials-title" eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} />

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((review, index) => {
            const copy = t.testimonials.items[review.id]
            return (
              <Reveal as="li" key={review.id} delay={index * 120}>
                <figure className="relative flex h-full flex-col rounded-3xl bg-cream-50 p-7 shadow-card ring-1 ring-sand-300/50 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <Quote aria-hidden="true" className="absolute end-6 top-6 size-10 text-terracotta-100 rtl:-scale-x-100" />
                  <div className="flex gap-1" role="img" aria-label={t.testimonials.ratingLabel(fmt.number(review.rating))}>
                    {Array.from({ length: 5 }, (_, star) => (
                      <Star
                        key={star}
                        aria-hidden="true"
                        className={`size-5 ${star < review.rating ? 'fill-saffron-500 text-saffron-500' : 'fill-sand-300 text-sand-300'}`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 leading-relaxed text-ink-700">
                    <p>{copy.quote}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-sand-300/60 pt-5">
                    <span
                      aria-hidden="true"
                      className={`grid size-12 shrink-0 place-items-center rounded-full font-bold text-cream-50 ${
                        avatarColors[index % avatarColors.length]
                      }`}
                    >
                      {initials(copy.name, locale === 'ar' ? 1 : 2)}
                    </span>
                    <span>
                      <span className="block font-bold text-olive-900">{copy.name}</span>
                      <span className="block text-sm text-ink-500">{copy.detail}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
