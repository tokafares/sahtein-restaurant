import { ShoppingBag } from 'lucide-react'
import { useEffect } from 'react'
import { useCart } from '../context/useCart'
import { useI18n } from '../i18n'

/**
 * Floating order button, pinned to the inline-end corner. Removed entirely while the cart is empty.
 * Phones get a compact 56px circle (icon and count only) so it covers as little content as
 * possible. From `sm` up it becomes a pill that also shows the total.
 */
export function CartFab() {
  const { t, fmt } = useI18n()
  const cart = useCart()
  const visible = cart.count > 0

  // Keep anchor jumps and keyboard focus from landing behind the button
  useEffect(() => {
    const root = document.documentElement
    if (visible) root.style.setProperty('scroll-padding-bottom', '6rem')
    else root.style.removeProperty('scroll-padding-bottom')
    return () => {
      root.style.removeProperty('scroll-padding-bottom')
    }
  }, [visible])

  return (
    <button
      type="button"
      onClick={cart.open}
      aria-label={t.cart.open(fmt.number(cart.count))}
      tabIndex={visible ? 0 : -1}
      className={`fixed end-4 bottom-4 z-30 flex size-14 items-center justify-center rounded-full bg-olive-800 text-cream-50 shadow-lift transition-[opacity,translate,visibility,background-color] duration-300 hover:bg-olive-900 sm:end-6 sm:bottom-6 sm:w-auto sm:justify-start sm:gap-3 sm:ps-4 sm:pe-5 ${
        visible ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-24 opacity-0'
      }`}
    >
      <span className="relative">
        <ShoppingBag aria-hidden="true" className="size-6" />
        <span
          key={cart.count}
          aria-hidden="true"
          className="absolute -end-2.5 -top-2.5 grid min-w-5 animate-pop place-items-center rounded-full bg-terracotta-500 px-1 text-xs leading-5 font-bold ring-2 ring-olive-800"
        >
          {fmt.number(cart.count)}
        </span>
      </span>
      <span aria-hidden="true" className="hidden text-sm font-bold sm:inline">
        {fmt.price(cart.total)}
      </span>
    </button>
  )
}
