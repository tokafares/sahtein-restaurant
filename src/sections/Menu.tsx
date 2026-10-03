import { Coffee, Croissant, Drumstick, IceCreamCone, Soup, type LucideIcon } from 'lucide-react'
import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { MenuCard } from '../components/MenuCard'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { menuItems } from '../data/menu'
import { useScrollEdges } from '../hooks/useScrollEdges'
import { useI18n } from '../i18n'
import { MENU_CATEGORIES, type MenuCategoryId } from '../types/menu'

const categoryIcons: Record<MenuCategoryId, LucideIcon> = {
  breakfast: Croissant,
  mains: Soup,
  grills: Drumstick,
  desserts: IceCreamCone,
  drinks: Coffee,
}

export function Menu() {
  const { t, dir } = useI18n()
  const [active, setActive] = useState<MenuCategoryId>('breakfast')
  const tabRefs = useRef<Partial<Record<MenuCategoryId, HTMLButtonElement | null>>>({})
  const tabScroller = useScrollEdges<HTMLDivElement>(dir)

  const items = useMemo(() => menuItems.filter((item) => item.category === active), [active])

  const selectTab = (category: MenuCategoryId) => {
    setActive(category)
    // Bring a partly hidden tab fully into view on narrow screens
    tabRefs.current[category]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }

  const focusTab = (category: MenuCategoryId) => {
    selectTab(category)
    tabRefs.current[category]?.focus()
  }

  // WAI-ARIA tabs pattern. "Next" follows reading direction, so ArrowLeft moves forward in RTL.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = MENU_CATEGORIES.indexOf(active)
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    const last = MENU_CATEGORIES.length - 1
    let next: number | null = null
    if (event.key === forward) next = index === last ? 0 : index + 1
    else if (event.key === backward) next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    const category = MENU_CATEGORIES[next]
    if (category) focusTab(category)
  }

  return (
    <section id="menu" aria-labelledby="menu-title" className="bg-cream-200/60 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="menu-title" eyebrow={t.menu.eyebrow} title={t.menu.title} subtitle={t.menu.subtitle} />

        <Reveal className="mt-10">
          {/* Scrollable on small screens; the negative margin lets tabs run to the screen edge,
              and a fade appears on whichever side has more tabs */}
          <div
            ref={tabScroller.ref}
            onScroll={tabScroller.update}
            style={tabScroller.fadeStyle}
            className="no-scrollbar -mx-4 overflow-x-auto scroll-px-4 px-4 py-1 sm:mx-0 sm:px-0"
          >
            <div
              role="tablist"
              aria-label={t.menu.categoriesLabel}
              onKeyDown={onKeyDown}
              className="mx-auto flex w-max gap-2 rounded-full bg-cream-50 p-1.5 shadow-card ring-1 ring-sand-300/60"
            >
              {MENU_CATEGORIES.map((category) => {
                const Icon = categoryIcons[category]
                const selected = category === active
                return (
                  <button
                    key={category}
                    ref={(node) => {
                      tabRefs.current[category] = node
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${category}`}
                    aria-selected={selected}
                    aria-controls="menu-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectTab(category)}
                    className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-bold whitespace-nowrap transition sm:px-5 ${
                      selected ? 'bg-olive-800 text-cream-50 shadow-card' : 'text-ink-700 hover:bg-cream-200'
                    }`}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {t.menu.categories[category]}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        <div
          id="menu-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
          className="mt-10 rounded-3xl"
        >
          <ul key={active} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <li key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                <MenuCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
