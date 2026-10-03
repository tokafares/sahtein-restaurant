export interface ReservationValues {
  name: string
  phone: string
  date: string
  time: string
  guests: string
  notes: string
}

export type ReservationField = keyof ReservationValues

export type ReservationErrorKey =
  | 'nameRequired'
  | 'nameShort'
  | 'phoneRequired'
  | 'phoneInvalid'
  | 'dateRequired'
  | 'datePast'
  | 'timeRequired'
  | 'timeHours'
  | 'guestsRange'
  | 'notesLong'

export type ReservationErrors = Partial<Record<ReservationField, ReservationErrorKey>>
