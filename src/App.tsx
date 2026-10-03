import { CartFab } from './components/CartFab'
import { CartPanel } from './components/CartPanel'
import { Navbar } from './components/Navbar'
import { CartProvider } from './context/CartProvider'
import { LanguageProvider, useI18n } from './i18n'
import { About } from './sections/About'
import { Footer } from './sections/Footer'
import { Gallery } from './sections/Gallery'
import { Hero } from './sections/Hero'
import { Menu } from './sections/Menu'
import { Reservation } from './sections/Reservation'
import { Testimonials } from './sections/Testimonials'

function Page() {
  const { t } = useI18n()
  return (
    <>
      <a
        href="#main"
        className="fixed start-4 top-4 z-[70] -translate-y-24 rounded-full bg-olive-800 px-5 py-3 font-bold text-cream-50 shadow-lift transition focus:translate-y-0"
      >
        {t.a11y.skipToContent}
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <Reservation />
        <Testimonials />
      </main>
      <Footer />
      <CartFab />
      <CartPanel />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Page />
      </CartProvider>
    </LanguageProvider>
  )
}
