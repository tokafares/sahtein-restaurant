import { ArrowUp, Camera, Clock, ExternalLink, Mail, MapPin, Music2, Phone, ThumbsUp, type LucideIcon } from 'lucide-react'
import { Logo } from '../components/Logo'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { EMAIL_HREF, MAP_DIRECTIONS_URL, MAP_EMBED_URL, PHONE_HREF } from '../data/site'
import { useI18n } from '../i18n'
import { whatsappUrl } from '../lib/whatsapp'
import type { SocialId } from '../types/i18n'

// lucide-react has no brand logos; these neutral glyphs stand in, with the platform name as the accessible label.
const socials: readonly { id: SocialId; icon: LucideIcon; href: string }[] = [
  { id: 'instagram', icon: Camera, href: 'https://instagram.com/' },
  { id: 'facebook', icon: ThumbsUp, href: 'https://facebook.com/' },
  { id: 'tiktok', icon: Music2, href: 'https://tiktok.com/' },
]

export function Footer() {
  const { t, fmt } = useI18n()
  const year = fmt.number(new Date().getFullYear()).replace(/[٬,]/g, '')

  return (
    <footer id="contact" aria-labelledby="contact-title" className="bg-olive-950 text-cream-200">
      <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Logo tone="light" />
            <p className="mt-4 max-w-md leading-relaxed">{t.footer.about}</p>
          </div>

          <div>
            <h2 id="contact-title" className="flex items-center gap-2 font-bold text-cream-50">
              <MapPin aria-hidden="true" className="size-5 text-terracotta-300" />
              {t.footer.addressTitle}
            </h2>
            <address className="mt-3 leading-relaxed not-italic">
              {t.footer.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={MAP_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-300 transition hover:text-cream-50"
            >
              {t.footer.directions}
              <ExternalLink aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
            </a>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-bold text-cream-50">
              <Clock aria-hidden="true" className="size-5 text-terracotta-300" />
              {t.footer.hoursTitle}
            </h2>
            <dl className="mt-3 space-y-2">
              {t.footer.hours.map((row) => (
                <div key={row.days}>
                  <dt className="text-sm text-olive-200">{row.days}</dt>
                  <dd className="font-semibold text-cream-50">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-bold text-cream-50">{t.footer.contactTitle}</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={PHONE_HREF} className="inline-flex items-center gap-2 transition hover:text-cream-50">
                  <Phone aria-hidden="true" className="size-4 text-terracotta-300" />
                  <span dir="ltr">{t.footer.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-cream-50"
                >
                  <WhatsAppIcon className="size-4 text-terracotta-300" />
                  {t.footer.whatsapp}
                </a>
              </li>
              <li>
                <a href={EMAIL_HREF} className="inline-flex items-center gap-2 transition hover:text-cream-50">
                  <Mail aria-hidden="true" className="size-4 text-terracotta-300" />
                  <span dir="ltr">{t.footer.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-cream-50">{t.footer.followTitle}</h2>
            <ul className="mt-3 flex gap-2">
              {socials.map(({ id, icon: Icon, href }) => (
                <li key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.footer.social[id]}
                    title={t.footer.social[id]}
                    className="grid size-11 place-items-center rounded-full bg-cream-50/10 text-cream-50 transition hover:-translate-y-0.5 hover:bg-terracotta-600"
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-olive-900 shadow-lift ring-1 ring-cream-50/10">
          <iframe
            title={t.footer.mapTitle}
            src={MAP_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-80 w-full border-0 grayscale-[35%] sepia-[15%] lg:h-full lg:min-h-[26rem]"
          />
        </div>
      </div>

      <div className="border-t border-cream-50/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-center text-sm sm:flex-row sm:text-start">
          <div>
            <p>{t.footer.rights(year)}</p>
            <p className="mt-1 text-olive-200">{t.footer.concept}</p>
          </div>
          <a
            href="#home"
            className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 px-4 py-2 font-semibold transition hover:bg-cream-50/10"
          >
            <ArrowUp aria-hidden="true" className="size-4" />
            {t.a11y.backToTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
