import { Menu as MenuIcon, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useCart } from '../context/useCart'
import { useActiveSection } from '../hooks/useActiveSection'
import { useEscape } from '../hooks/useEscape'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useScrolled } from '../hooks/useScrolled'
import { useI18n } from '../i18n'
import { NAV_SECTIONS } from '../types/section'
import { LanguageToggle } from './LanguageToggle'
import { Logo } from './Logo'
import { WhatsAppIcon } from './WhatsAppIcon'

export function Navbar() {
  const { t } = useI18n()
  const cart = useCart()
  const scrolled = useScrolled()
  const active = useActiveSection(NAV_SECTIONS)
  const [mobileOpen, setMobileOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
    toggleRef.current?.focus()
  }, [])

  useEscape(mobileOpen, closeMobile)
  useLockBodyScroll(mobileOpen)

  useEffect(() => {
    if (mobileOpen) panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
  }, [mobileOpen])

  // Close the drawer if the viewport grows to desktop size
  useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)')
    const onChange = () => query.matches && setMobileOpen(false)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const openOrder = () => {
    setMobileOpen(false)
    cart.open()
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled ? 'bg-cream-50/90 shadow-card backdrop-blur-md' : 'bg-cream-100'
        }`}
      >
        <nav aria-label={t.a11y.mainNav} className="container-page flex h-18 items-center justify-between gap-4">
          <a href="#home" className="shrink-0 rounded-xl">
            <Logo />
          </a>
  
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'location' : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition hover:text-terracotta-600 ${
                    active === id ? 'text-terracotta-600' : 'text-ink-700'
                  }`}
                >
                  {t.nav.links[id]}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-terracotta-500 transition-transform duration-300 ${
                      active === id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
  
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              type="button"
              onClick={openOrder}
              className="hidden h-10 items-center gap-2 rounded-full bg-terracotta-600 px-4 text-sm font-bold text-cream-50 shadow-card transition hover:bg-terracotta-700 sm:inline-flex"
            >
              <WhatsAppIcon className="size-4" />
              {t.nav.order}
            </button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t.a11y.openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="grid size-10 place-items-center rounded-full text-olive-900 transition hover:bg-olive-800/10 lg:hidden"
            >
              <MenuIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-[visibility] duration-300 lg:hidden ${mobileOpen ? 'visible' : 'invisible'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={closeMobile}
          className={`absolute inset-0 bg-olive-950/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.a11y.mainNav}
          className={`absolute inset-y-0 end-0 flex w-[min(20rem,85vw)] flex-col bg-cream-50 shadow-lift transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'
          }`}
        >
          <div className="flex h-18 items-center justify-between border-b border-sand-300/60 px-4">
            <Logo />
            <button
              type="button"
              onClick={closeMobile}
              aria-label={t.a11y.closeMenu}
              className="grid size-10 place-items-center rounded-full text-olive-900 transition hover:bg-olive-800/10"
            >
              <X aria-hidden="true" className="size-6" />
            </button>
          </div>
          <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setMobileOpen(false)}
                  tabIndex={mobileOpen ? 0 : -1}
                  aria-current={active === id ? 'location' : undefined}
                  className={`block rounded-xl px-4 py-3 text-lg font-semibold transition hover:bg-cream-200 ${
                    active === id ? 'bg-cream-200 text-terracotta-600' : 'text-ink-900'
                  }`}
                >
                  {t.nav.links[id]}
                </a>
              </li>
            ))}
          </ul>
          <div className="border-t border-sand-300/60 p-4">
            <button
              type="button"
              onClick={openOrder}
              tabIndex={mobileOpen ? 0 : -1}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 font-bold text-cream-50 transition hover:bg-terracotta-700"
            >
              <WhatsAppIcon className="size-5" />
              {t.nav.order}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
