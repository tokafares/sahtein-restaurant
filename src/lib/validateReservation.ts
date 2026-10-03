import { MAX_GUESTS, NOTES_MAX_LENGTH } from '../data/site'
import { bookableDates, slotsFor, toIsoDate } from './schedule'
import type { ReservationErrors, ReservationValues } from '../types/reservation'

const EGYPT_MOBILE = /^(?:\+20|0020|20)?0?1[0125]\d{8}$/

/** Converts Arabic-Indic digits (٠-٩) to ASCII so Arabic keyboards validate too. */
export function toAsciiDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
}

export function normalizePhone(value: string): string {
  return toAsciiDigits(value).replace(/[\s\-()]/g, '')
}

export function validateReservation(values: ReservationValues, now: Date = new Date()): ReservationErrors {
  const errors: ReservationErrors = {}
  const name = values.name.trim()
  const phone = normalizePhone(values.phone)
  const guests = Number(values.guests)

  if (!name) errors.name = 'nameRequired'
  else if (name.length < 2) errors.name = 'nameShort'

  if (!phone) errors.phone = 'phoneRequired'
  else if (!EGYPT_MOBILE.test(phone)) errors.phone = 'phoneInvalid'

  // The pickers only offer valid choices; these checks also catch a date or slot
  // that expired while the form was open.
  if (!values.date) errors.date = 'dateRequired'
  else if (values.date < toIsoDate(now) || !bookableDates(now).includes(values.date)) errors.date = 'datePast'

  if (!values.time) errors.time = 'timeRequired'
  else if (values.date && !errors.date && !slotsFor(values.date, now).includes(values.time)) errors.time = 'timeHours'

  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) errors.guests = 'guestsRange'

  if (values.notes.length > NOTES_MAX_LENGTH) errors.notes = 'notesLong'

  return errors
}
