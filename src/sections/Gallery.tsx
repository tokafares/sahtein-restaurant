import { Expand } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { galleryImages } from '../data/gallery'
import { useI18n } from '../i18n'
import { unsplash, unsplashSrcSet } from '../lib/unsplash'

export function Gallery() {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  const close = useCallback(() => {
    // Return focus to the thumbnail of the image being viewed
    if (openIndex !== null) triggerRefs.current[openIndex]?.focus()
    setOpenIndex(null)
  }, [openIndex])

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="gallery-title" eyebrow={t.gallery.eyebrow} title={t.gallery.title} subtitle={t.gallery.subtitle} />

        <ul className="mt-12 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
          {galleryImages.map((image, index) => {
            const alt = t.gallery.images[image.id]
            const width = 600
            const height = Math.round(width / image.ratio)
            return (
              <li key={image.id} className="mb-3 break-inside-avoid sm:mb-4">
                <Reveal delay={(index % 4) * 80}>
                  <button
                    ref={(node) => {
                      triggerRefs.current[index] = node
                    }}
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    aria-label={t.gallery.openImage(alt)}
                    className="group relative block w-full overflow-hidden rounded-2xl bg-cream-200 shadow-card"
                  >
                    <img
                      src={unsplash(image.image, width, height)}
                      srcSet={unsplashSrcSet(image.image, [320, 480, 600, 800], image.ratio)}
                      sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
                      alt={alt}
                      width={width}
                      height={height}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full transition duration-500 ease-out group-hover:scale-105"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 grid place-items-center bg-olive-950/0 text-cream-50 opacity-0 transition duration-300 group-hover:bg-olive-950/35 group-hover:opacity-100 group-focus-visible:bg-olive-950/35 group-focus-visible:opacity-100"
                    >
                      <span className="grid size-12 place-items-center rounded-full bg-cream-50/20 backdrop-blur">
                        <Expand className="size-5" />
                      </span>
                    </span>
                  </button>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>

      <Lightbox images={galleryImages} index={openIndex} onChange={setOpenIndex} onClose={close} />
    </section>
  )
}
