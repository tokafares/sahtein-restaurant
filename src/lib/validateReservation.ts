import { BOOKING_CLOSE, BOOKING_OPEN, MAX_GUESTS, NOTES_MAX_LENGTH } from '../data/site'
import type { ReservationErrors, ReservationValues } from '../types/reservation'

const EGYPT_MOBILE = /^(?:\+20|0020|20)?0?1[0125]\d{8}$/

/** Converts Arabic-Indic digits (٠-٩) to ASCII so Arabic keyboards validate too. */
export function toAsciiDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
}

export function normalizePhone(value: string): string {
  return toAsciiDigits(value).replace(/[\s\-()]/g, '')
}

/** Today's date as yyyy-mm-dd in the visitor's local time zone */
export function todayIso(now: Date = new Date()): string {
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export function validateReservation(values: ReservationValues, today: string = todayIso()): ReservationErrors {
  const errors: ReservationErrors = {}
  const name = values.name.trim()
  const phone = normalizePhone(values.phone)
  const guests = Number(values.guests)

  if (!name) errors.name = 'nameRequired'
  else if (name.length < 2) errors.name = 'nameShort'

  if (!phone) errors.phone = 'phoneRequired'
  else if (!EGYPT_MOBILE.test(phone)) errors.phone = 'phoneInvalid'

  if (!values.date) errors.date = 'dateRequired'
  else if (values.date < today) errors.date = 'datePast'

  if (!values.time) errors.time = 'timeRequired'
  else if (values.time < BOOKING_OPEN || values.time > BOOKING_CLOSE) errors.time = 'timeHours'

  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) errors.guests = 'guestsRange'

  if (values.notes.length > NOTES_MAX_LENGTH) errors.notes = 'notesLong'

  return errors
}
