import { Flame, Leaf, Minus, Plus, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useI18n } from '../i18n'
import { unsplash, unsplashSrcSet } from '../lib/unsplash'
import type { MenuItem, MenuTag } from '../types/menu'
import { WhatsAppIcon } from './icons/WhatsAppIcon'

const tagIcons: Record<MenuTag, LucideIcon> = { popular: Star, vegetarian: Leaf, spicy: Flame }
const tagStyles: Record<MenuTag, string> = {
  popular: 'bg-saffron-500 text-ink-900',
  vegetarian: 'bg-olive-700 text-cream-50',
  spicy: 'bg-terracotta-600 text-cream-50',
}

export function MenuCard({ item }: { item: MenuItem }) {
  const { t, fmt } = useI18n()
  const cart = useCart()
  const copy = t.menu.items[item.id]
  const quantity = cart.quantityOf(item.id)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-cream-50 shadow-card ring-1 ring-sand-300/50 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        <img
          src={unsplash(item.image, 600, 450)}
          srcSet={unsplashSrcSet(item.image, [400, 600, 800], 4 / 3)}
          sizes="(min-width: 80rem) 22rem, (min-width: 40rem) 45vw, 100vw"
          alt={copy.imageAlt}
          width={600}
          height={450}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition duration-500 ease-out group-hover:scale-105"
        />
        {item.tags.length > 0 && (
          <ul className="absolute start-3 top-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => {
              const Icon = tagIcons[tag]
              return (
                <li
                  key={tag}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-card ${tagStyles[tag]}`}
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                  {t.menu.tags[tag]}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-olive-900">{copy.name}</h3>
          <p className="shrink-0 rounded-full bg-terracotta-100 px-3 py-1 text-sm font-extrabold text-terracotta-700">
            {fmt.price(item.price)}
          </p>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{copy.description}</p>

        <div className="mt-5">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => cart.add(item.id)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-olive-800 font-bold text-olive-900 transition hover:bg-olive-800 hover:text-cream-50 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-4" />
              {t.menu.addToOrder}
            </button>
          ) : (
            <div className="flex h-11 items-center justify-between gap-2 rounded-full bg-olive-800 p-1 text-cream-50">
              <button
                type="button"
                onClick={() => cart.decrement(item.id)}
                aria-label={t.menu.decrease(copy.name)}
                className="grid size-9 place-items-center rounded-full bg-cream-50/10 transition hover:bg-cream-50/25"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <span key={quantity} aria-live="polite" className="animate-pop text-sm font-bold">
                {t.menu.quantityInCart(fmt.number(quantity))}
              </span>
              <button
                type="button"
                onClick={() => cart.add(item.id)}
                aria-label={t.menu.increase(copy.name)}
                className="grid size-9 place-items-center rounded-full bg-cream-50/10 transition hover:bg-cream-50/25"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
