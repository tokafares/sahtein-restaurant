import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { menuById } from '../data/menu'
import { useCart } from '../context/useCart'
import { useEscape } from '../hooks/useEscape'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useI18n } from '../i18n'
import { unsplash } from '../lib/unsplash'
import { buildOrderMessage, whatsappUrl } from '../lib/whatsapp'
import { WhatsAppIcon } from './WhatsAppIcon'

export function CartPanel() {
  const { t, fmt } = useI18n()
  const cart = useCart()
  const { isOpen, close } = cart
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEscape(isOpen, close)
  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      closeRef.current?.focus()
    } else {
      returnFocusRef.current?.focus()
      returnFocusRef.current = null
    }
  }, [isOpen])

  const message = buildOrderMessage(cart.lines, cart.total, t, fmt)
  const empty = cart.lines.length === 0

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-[visibility] ${isOpen ? 'visible duration-0' : 'invisible duration-300'}`}>
      <div
        aria-hidden="true"
        onClick={close}
        className={`absolute inset-0 bg-olive-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-cream-50 shadow-lift transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-sand-300/60 px-5 py-4">
          <div>
            <h2 id="cart-title" className="text-xl font-extrabold text-olive-900">
              {t.cart.title}
            </h2>
            <p className="text-sm text-ink-500">{t.cart.itemCount(cart.count, fmt.number(cart.count))}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t.cart.close}
            className="grid size-10 place-items-center rounded-full text-olive-900 transition hover:bg-olive-800/10"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </header>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid size-20 place-items-center rounded-full bg-cream-200 text-olive-700">
              <ShoppingBag aria-hidden="true" className="size-9" />
            </span>
            <div>
              <p className="text-lg font-bold text-olive-900">{t.cart.empty}</p>
              <p className="mt-1 text-ink-500">{t.cart.emptyHint}</p>
            </div>
            <a
              href="#menu"
              onClick={close}
              className="inline-flex h-11 items-center rounded-full bg-olive-800 px-6 font-bold text-cream-50 transition hover:bg-olive-900"
            >
              {t.cart.browseMenu}
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-sand-300/50 overflow-y-auto px-5">
              {cart.lines.map((line) => {
                const item = menuById.get(line.id)
                const name = t.menu.items[line.id].name
                return (
                  <li key={line.id} className="flex gap-3 py-4">
                    {item && (
                      <img
                        src={unsplash(item.image, 160, 160)}
                        alt=""
                        width={64}
                        height={64}
                        decoding="async"
                        className="size-16 shrink-0 rounded-xl object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-olive-900">{name}</p>
                        <button
                          type="button"
                          onClick={() => cart.remove(line.id)}
                          aria-label={t.cart.remove(name)}
                          className="-m-1.5 grid size-8 shrink-0 place-items-center rounded-full text-ink-500 transition hover:bg-terracotta-100 hover:text-terracotta-700"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                      <p className="text-sm text-ink-500">{fmt.price(line.unitPrice)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full bg-cream-200 p-0.5">
                          <button
                            type="button"
                            onClick={() => cart.decrement(line.id)}
                            aria-label={t.menu.decrease(name)}
                            className="grid size-8 place-items-center rounded-full transition hover:bg-cream-50"
                          >
                            <Minus aria-hidden="true" className="size-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-bold" aria-live="polite">
                            {fmt.number(line.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => cart.add(line.id)}
                            aria-label={t.menu.increase(name)}
                            className="grid size-8 place-items-center rounded-full transition hover:bg-cream-50"
                          >
                            <Plus aria-hidden="true" className="size-3.5" />
                          </button>
                        </div>
                        <p className="font-bold text-terracotta-700">{fmt.price(line.lineTotal)}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <footer className="border-t border-sand-300/60 bg-cream-100 px-5 pt-4 pb-5">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold text-ink-700">{t.cart.subtotal}</span>
                <span className="font-extrabold text-olive-900">{fmt.price(cart.total)}</span>
              </div>
              <p className="mt-1 text-sm text-ink-500">{t.cart.deliveryNote}</p>
              <a
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 font-bold text-cream-50 shadow-card transition hover:bg-terracotta-700"
              >
                <WhatsAppIcon className="size-5" />
                {t.cart.send}
              </a>
              <button
                type="button"
                onClick={cart.clear}
                className="mt-2 h-10 w-full rounded-full text-sm font-semibold text-ink-500 transition hover:bg-cream-200 hover:text-ink-900"
              >
                {t.cart.clear}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
