import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useI18n } from '../i18n'

/** Floating order button, pinned to the inline-end corner. Hidden while the cart is empty. */
export function CartFab() {
  const { t, fmt } = useI18n()
  const cart = useCart()
  const visible = cart.count > 0

  return (
    <button
      type="button"
      onClick={cart.open}
      aria-label={t.cart.open(fmt.number(cart.count))}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed end-4 bottom-4 z-30 flex h-14 items-center gap-3 rounded-full bg-olive-800 ps-4 pe-5 text-cream-50 shadow-lift transition duration-300 hover:bg-olive-900 sm:end-6 sm:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
      }`}
    >
      <span className="relative">
        <ShoppingBag aria-hidden="true" className="size-6" />
        <span
          key={cart.count}
          className="absolute -end-2.5 -top-2.5 grid min-w-5 animate-pop place-items-center rounded-full bg-terracotta-500 px-1 text-xs leading-5 font-bold"
        >
          {fmt.number(cart.count)}
        </span>
      </span>
      <span className="text-sm font-bold">{fmt.price(cart.total)}</span>
    </button>
  )
}
