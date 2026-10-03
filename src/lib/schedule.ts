import {
  BOOKING_DAYS_AHEAD,
  BOOKING_LEAD_MINUTES,
  LAST_SEATING_BEFORE_CLOSE,
  OPENING_HOURS,
  SLOT_INTERVAL_MINUTES,
} from '../data/site'

/**
 * Booking schedule. Times are "HH:mm" strings measured from the start of the
 * booking day, so a Friday slot after midnight is "24:30", not "00:30".
 * This keeps every slot of one service on the same date and sorts correctly.
 * Dates and times use the visitor's local clock.
 */

export function toMinutes(time: string): number {
  const [h = '0', m = '0'] = time.split(':')
  return Number(h) * 60 + Number(m)
}

export function fromMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** yyyy-mm-dd for a local date */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return toIsoDate(date) === iso ? date : null
}

export function hoursFor(iso: string): { open: number; close: number } | null {
  const date = parseIsoDate(iso)
  if (!date) return null
  return date.getDay() === 5 ? OPENING_HOURS.friday : OPENING_HOURS.default
}

/** Bookable slots for a date, dropping ones that start too soon when the date is today */
export function slotsFor(iso: string, now: Date = new Date()): string[] {
  const hours = hoursFor(iso)
  if (!hours) return []
  const isToday = iso === toIsoDate(now)
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + BOOKING_LEAD_MINUTES : 0
  const slots: string[] = []
  for (let t = hours.open; t <= hours.close - LAST_SEATING_BEFORE_CLOSE; t += SLOT_INTERVAL_MINUTES) {
    if (t >= earliest) slots.push(fromMinutes(t))
  }
  return slots
}

/** The next bookable dates, starting today unless today has no slots left */
export function bookableDates(now: Date = new Date(), count: number = BOOKING_DAYS_AHEAD): string[] {
  const dates: string[] = []
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  while (dates.length < count) {
    const iso = toIsoDate(cursor)
    if (slotsFor(iso, now).length > 0) dates.push(iso)
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export function isBookable(iso: string, time: string, now: Date = new Date()): boolean {
  return bookableDates(now).includes(iso) && slotsFor(iso, now).includes(time)
}
