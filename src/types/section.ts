export const NAV_SECTIONS = ['about', 'menu', 'gallery', 'reservation', 'testimonials', 'contact'] as const
export type NavSectionId = (typeof NAV_SECTIONS)[number]
export type SectionId = 'home' | NavSectionId
