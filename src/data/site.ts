/** Fake WhatsApp number (international format, digits only) for this concept project */
export const WHATSAPP_NUMBER = '201000000000'
export const PHONE_HREF = 'tel:+201000000000'
export const EMAIL_HREF = 'mailto:hello@sahtein.example'

/** Zamalek, Cairo */
export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=Zamalek%2C%20Cairo%2C%20Egypt&t=&z=15&ie=UTF8&iwloc=&output=embed'
export const MAP_DIRECTIONS_URL = 'https://www.google.com/maps/search/?api=1&query=Zamalek%2C+Cairo%2C+Egypt'

export const images = {
  hero: 'photo-1734772192785-2986a99ce40f',
  about: 'photo-1758745464235-ccb8c1253074',
  reservation: 'photo-1658416439082-02fdbf7fb61c',
} as const

/**
 * Opening hours in minutes from the start of the day. Close can pass midnight
 * (Friday closes at 01:00, i.e. 25 × 60).
 */
export const OPENING_HOURS = {
  default: { open: 12 * 60, close: 24 * 60 }, // Saturday–Thursday 12:00–00:00
  friday: { open: 13 * 60, close: 25 * 60 }, // Friday 13:00–01:00
} as const
export const SLOT_INTERVAL_MINUTES = 30
/** Last table is seated this long before closing */
export const LAST_SEATING_BEFORE_CLOSE = 30
/** Same-day bookings need at least this much notice */
export const BOOKING_LEAD_MINUTES = 60
export const BOOKING_DAYS_AHEAD = 14
export const MAX_GUESTS = 12
export const NOTES_MAX_LENGTH = 300
