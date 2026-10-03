import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  subtitle?: string
  id?: string
  align?: 'center' | 'start'
  tone?: 'light' | 'dark'
}

export function SectionHeading({ eyebrow, title, subtitle, id, align = 'center', tone = 'light' }: SectionHeadingProps) {
  const centered = align === 'center'
  const dark = tone === 'dark'
  return (
    <Reveal className={`max-w-2xl ${centered ? 'mx-auto text-center' : 'text-start'}`}>
      <p
        className={`mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase ${
          dark ? 'text-terracotta-300' : 'text-terracotta-600'
        }`}
      >
        <span aria-hidden="true" className="h-px w-8 bg-current" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`text-3xl leading-tight font-extrabold text-balance sm:text-4xl ${dark ? 'text-cream-50' : 'text-olive-900'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed text-pretty sm:text-lg ${dark ? 'text-cream-200' : 'text-ink-500'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
