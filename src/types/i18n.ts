import type { GalleryImageId } from './gallery'
import type { MenuCategoryId, MenuItemId, MenuTag } from './menu'
import type { ReservationErrorKey } from './reservation'
import type { NavSectionId } from './section'
import type { TestimonialId } from './testimonial'

export type Locale = 'ar' | 'en'

interface FieldCopy {
  label: string
  placeholder: string
}

interface MenuItemCopy {
  name: string
  description: string
  imageAlt: string
}

export type FeatureId = 'recipes' | 'fresh' | 'grill'
export type SocialId = 'instagram' | 'facebook' | 'tiktok'

/**
 * Every user-facing string lives here. Both locale files are typed against this
 * interface, so a missing or misspelled key fails the type check.
 * Functions receive values that are already locale-formatted (digits, prices).
 */
export interface Translations {
  meta: {
    title: string
    description: string
  }
  brand: {
    name: string
    tagline: string
  }
  a11y: {
    skipToContent: string
    mainNav: string
    openMenu: string
    closeMenu: string
    switchLanguage: string
    backToTop: string
  }
  nav: {
    links: Record<NavSectionId, string>
    order: string
  }
  language: {
    /** Label of the button that switches *to* the other language */
    switchTo: string
  }
  hero: {
    eyebrow: string
    title: string
    titleAccent: string
    subtitle: string
    viewMenu: string
    bookTable: string
    imageAlt: string
    highlights: readonly [string, string, string]
  }
  about: {
    eyebrow: string
    title: string
    story: readonly string[]
    imageAlt: string
    since: string
    sinceYear: string
    features: Record<FeatureId, { title: string; text: string }>
  }
  menu: {
    eyebrow: string
    title: string
    subtitle: string
    categoriesLabel: string
    categories: Record<MenuCategoryId, string>
    tags: Record<MenuTag, string>
    items: Record<MenuItemId, MenuItemCopy>
    addToOrder: string
    increase: (name: string) => string
    decrease: (name: string) => string
    quantityInCart: (quantity: string) => string
  }
  cart: {
    title: string
    open: (count: string) => string
    close: string
    empty: string
    emptyHint: string
    browseMenu: string
    subtotal: string
    deliveryNote: string
    send: string
    clear: string
    remove: (name: string) => string
    itemCount: (count: number, formatted: string) => string
    message: {
      greeting: string
      line: (quantity: string, name: string, total: string) => string
      total: (total: string) => string
      closing: string
    }
  }
  gallery: {
    eyebrow: string
    title: string
    subtitle: string
    images: Record<GalleryImageId, string>
    openImage: (alt: string) => string
    dialogLabel: string
    close: string
    previous: string
    next: string
    counter: (current: string, total: string) => string
  }
  reservation: {
    eyebrow: string
    title: string
    subtitle: string
    imageAlt: string
    infoTitle: string
    info: readonly string[]
    fields: {
      name: FieldCopy
      phone: FieldCopy
      date: FieldCopy
      time: FieldCopy
      guests: FieldCopy
      notes: FieldCopy
    }
    guestsOption: (count: number, formatted: string) => string
    optional: string
    submit: string
    submitting: string
    errors: Record<ReservationErrorKey, string>
    errorSummary: string
    success: {
      title: string
      text: (name: string) => string
      summary: (guests: string, date: string, time: string) => string
      again: string
    }
  }
  testimonials: {
    eyebrow: string
    title: string
    ratingLabel: (rating: string) => string
    items: Record<TestimonialId, { name: string; detail: string; quote: string }>
  }
  footer: {
    about: string
    addressTitle: string
    address: readonly string[]
    directions: string
    hoursTitle: string
    hours: readonly { days: string; time: string }[]
    contactTitle: string
    phone: string
    email: string
    whatsapp: string
    followTitle: string
    social: Record<SocialId, string>
    mapTitle: string
    rights: (year: string) => string
    concept: string
  }
}
