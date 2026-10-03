import { AlertCircle, CalendarCheck, CheckCircle2, Clock, Loader2, Phone, User, Users } from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { DateChips } from '../components/DateChips'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TimeSlots } from '../components/TimeSlots'
import { MAX_GUESTS, NOTES_MAX_LENGTH, images } from '../data/site'
import { useI18n } from '../i18n'
import { unsplash, unsplashSrcSet } from '../lib/unsplash'
import { bookableDates, fromMinutes, hoursFor, slotsFor } from '../lib/schedule'
import { validateReservation } from '../lib/validateReservation'
import type { ReservationErrors, ReservationField, ReservationValues } from '../types/reservation'

const EMPTY: ReservationValues = { name: '', phone: '', date: '', time: '', guests: '', notes: '' }
const FIELD_ORDER: readonly ReservationField[] = ['name', 'phone', 'date', 'time', 'guests', 'notes']
const GUEST_OPTIONS = Array.from({ length: MAX_GUESTS }, (_, i) => i + 1)

const inputBase =
  'block w-full rounded-xl border bg-cream-50 px-4 py-3 text-ink-900 placeholder:text-ink-500/70 transition focus:border-olive-700 focus:ring-2 focus:ring-olive-700/20 focus:outline-none'

interface FieldProps {
  id: ReservationField
  label: string
  error?: string
  icon?: ReactNode
  optional?: string
  hint?: string
  children: ReactNode
  className?: string
  /** For radio groups: render a plain label element referenced by aria-labelledby */
  group?: boolean
}

function Field({ id, label, error, icon, optional, hint, children, className = '', group = false }: FieldProps) {
  const labelClass = 'mb-1.5 flex items-center gap-2 text-sm font-bold text-olive-900'
  const labelContent = (
    <>
      {icon}
      {label}
      {optional && <span className="font-medium text-ink-500">({optional})</span>}
    </>
  )
  return (
    <div className={`min-w-0 ${className}`}>
      {group ? (
        <p id={`res-${id}-label`} className={labelClass}>
          {labelContent}
        </p>
      ) : (
        <label htmlFor={`res-${id}`} className={labelClass}>
          {labelContent}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`res-${id}-hint`} className="mt-1.5 text-xs text-ink-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`res-${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-terracotta-700">
          <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export function Reservation() {
  const { t, fmt } = useI18n()
  const [values, setValues] = useState<ReservationValues>(EMPTY)
  const [errors, setErrors] = useState<ReservationErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [confirmed, setConfirmed] = useState<ReservationValues | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  // Computed once per mount; validation re-checks against the clock on submit
  const dates = useMemo(() => bookableDates(), [])
  const slots = useMemo(() => (values.date ? slotsFor(values.date) : []), [values.date])

  const update = (next: ReservationValues) => {
    setValues(next)
    // After the first submit attempt, re-validate live so errors clear as soon as they're fixed
    if (submitted) setErrors(validateReservation(next))
  }

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const field = event.target.name as ReservationField
    update({ ...values, [field]: event.target.value })
  }

  // Keep the chosen time only if the new date offers it (Friday opens later)
  const onDateChange = (date: string) =>
    update({ ...values, date, time: slotsFor(date).includes(values.time) ? values.time : '' })
  const onTimeChange = (time: string) => update({ ...values, time })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const nextErrors = validateReservation(values)
    setErrors(nextErrors)
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) {
      const target = formRef.current?.querySelector<HTMLElement>(`#res-${firstInvalid}`)
      // Radio groups take focus on their single tabbable option
      const option = target?.getAttribute('role') === 'radiogroup' ? target.querySelector<HTMLElement>('[tabindex="0"]') : null
      ;(option ?? target)?.focus()
      return
    }
    setStatus('submitting')
    // No backend: simulate a short network round-trip
    window.setTimeout(() => {
      setConfirmed({ ...values, name: values.name.trim() })
      setStatus('success')
      requestAnimationFrame(() => successRef.current?.focus())
    }, 700)
  }

  const reset = () => {
    setValues(EMPTY)
    setErrors({})
    setSubmitted(false)
    setConfirmed(null)
    setStatus('idle')
  }

  const errorText = (field: ReservationField) => {
    const key = errors[field]
    return key ? t.reservation.errors[key] : undefined
  }

  const a11yProps = (field: ReservationField) => ({
    id: `res-${field}`,
    name: field,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `res-${field}-error` : undefined,
  })

  const borderFor = (field: ReservationField) => (errors[field] ? 'border-terracotta-500' : 'border-sand-300')
  const hasErrors = submitted && Object.keys(errors).length > 0
  const fields = t.reservation.fields
  const iconClass = 'size-4 text-terracotta-600'
  const dayHours = values.date ? hoursFor(values.date) : null
  const timeHint = dayHours
    ? t.reservation.timePicker.hoursHint(fmt.time(fromMinutes(dayHours.open)), fmt.time(fromMinutes(dayHours.close)))
    : undefined

  return (
    <section id="reservation" aria-labelledby="reservation-title" className="bg-olive-900 py-20 text-cream-50 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <SectionHeading
            id="reservation-title"
            eyebrow={t.reservation.eyebrow}
            title={t.reservation.title}
            subtitle={t.reservation.subtitle}
            align="start"
            tone="dark"
          />
          <Reveal delay={100} className="mt-8 overflow-hidden rounded-3xl">
            <img
              src={unsplash(images.reservation, 800, 520)}
              srcSet={unsplashSrcSet(images.reservation, [480, 800, 1100], 800 / 520)}
              sizes="(min-width: 64rem) 40vw, 100vw"
              alt={t.reservation.imageAlt}
              width={800}
              height={520}
              loading="lazy"
              decoding="async"
              className="aspect-[800/520] w-full object-cover"
            />
          </Reveal>
          <Reveal delay={150} className="mt-6 rounded-2xl border border-cream-50/15 bg-cream-50/5 p-5">
            <h3 className="font-bold text-terracotta-300">{t.reservation.infoTitle}</h3>
            <ul className="mt-3 space-y-2 text-cream-200">
              {t.reservation.info.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-olive-200" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="rounded-[2rem] bg-cream-100 p-6 text-ink-900 shadow-lift sm:p-8">
            {status === 'success' && confirmed ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                className="flex min-h-[28rem] animate-fade-in flex-col items-center justify-center text-center"
              >
                <span className="grid size-20 animate-pop place-items-center rounded-full bg-olive-100 text-olive-700">
                  <CheckCircle2 aria-hidden="true" className="size-10" />
                </span>
                <h3 className="mt-6 text-2xl font-extrabold text-olive-900">{t.reservation.success.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-ink-500">{t.reservation.success.text(confirmed.name)}</p>
                <p className="mt-5 rounded-full bg-cream-200 px-5 py-2.5 text-sm font-bold text-olive-900">
                  {t.reservation.success.summary(
                    t.reservation.guestsOption(Number(confirmed.guests), fmt.number(Number(confirmed.guests))),
                    fmt.date(confirmed.date),
                    fmt.time(confirmed.time),
                  )}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 inline-flex h-11 items-center rounded-full border-2 border-olive-800 px-6 font-bold text-olive-900 transition hover:bg-olive-800 hover:text-cream-50"
                >
                  {t.reservation.success.again}
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                {hasErrors && (
                  <p
                    role="alert"
                    className="flex items-center gap-2 rounded-xl bg-terracotta-100 px-4 py-3 text-sm font-semibold text-terracotta-700 sm:col-span-2"
                  >
                    <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
                    {t.reservation.errorSummary}
                  </p>
                )}

                <Field id="name" label={fields.name.label} error={errorText('name')} icon={<User aria-hidden="true" className={iconClass} />}>
                  <input
                    {...a11yProps('name')}
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={onChange}
                    placeholder={fields.name.placeholder}
                    className={`${inputBase} ${borderFor('name')}`}
                  />
                </Field>

                <Field id="phone" label={fields.phone.label} error={errorText('phone')} icon={<Phone aria-hidden="true" className={iconClass} />}>
                  <input
                    {...a11yProps('phone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    value={values.phone}
                    onChange={onChange}
                    placeholder={fields.phone.placeholder}
                    className={`${inputBase} text-start ${borderFor('phone')}`}
                  />
                </Field>

                <Field
                  id="date"
                  group
                  label={fields.date.label}
                  error={errorText('date')}
                  icon={<CalendarCheck aria-hidden="true" className={iconClass} />}
                  className="sm:col-span-2"
                >
                  <DateChips
                    id="res-date"
                    labelId="res-date-label"
                    dates={dates}
                    value={values.date}
                    onChange={onDateChange}
                    invalid={Boolean(errors.date)}
                    describedBy={errors.date ? 'res-date-error' : undefined}
                  />
                </Field>

                <Field
                  id="time"
                  group
                  label={fields.time.label}
                  error={errorText('time')}
                  hint={timeHint}
                  icon={<Clock aria-hidden="true" className={iconClass} />}
                  className="sm:col-span-2"
                >
                  {values.date ? (
                    <TimeSlots
                      key={values.date}
                      id="res-time"
                      labelId="res-time-label"
                      slots={slots}
                      value={values.time}
                      onChange={onTimeChange}
                      invalid={Boolean(errors.time)}
                      describedBy={errors.time ? 'res-time-error' : timeHint ? 'res-time-hint' : undefined}
                    />
                  ) : (
                    <p
                      id="res-time"
                      tabIndex={-1}
                      className={`rounded-xl border border-dashed px-4 py-3 text-sm text-ink-500 ${
                        errors.time ? 'border-terracotta-500' : 'border-sand-300'
                      }`}
                    >
                      {t.reservation.timePicker.chooseDateFirst}
                    </p>
                  )}
                </Field>

                <Field
                  id="guests"
                  label={fields.guests.label}
                  error={errorText('guests')}
                  icon={<Users aria-hidden="true" className={iconClass} />}
                  className="sm:col-span-2"
                >
                  <select
                    {...a11yProps('guests')}
                    value={values.guests}
                    onChange={onChange}
                    className={`${inputBase} min-h-12 ${borderFor('guests')}`}
                  >
                    <option value="" disabled>
                      {fields.guests.placeholder}
                    </option>
                    {GUEST_OPTIONS.map((count) => (
                      <option key={count} value={String(count)}>
                        {t.reservation.guestsOption(count, fmt.number(count))}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  id="notes"
                  label={fields.notes.label}
                  optional={t.reservation.optional}
                  error={errorText('notes')}
                  hint={`${fmt.number(values.notes.length)} / ${fmt.number(NOTES_MAX_LENGTH)}`}
                  className="sm:col-span-2"
                >
                  <textarea
                    {...a11yProps('notes')}
                    rows={3}
                    value={values.notes}
                    onChange={onChange}
                    placeholder={fields.notes.placeholder}
                    className={`${inputBase} resize-y ${borderFor('notes')}`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-terracotta-600 px-7 font-bold text-cream-50 shadow-card transition hover:bg-terracotta-700 disabled:cursor-wait disabled:opacity-80 sm:col-span-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 aria-hidden="true" className="size-5 animate-spin" />
                      {t.reservation.submitting}
                    </>
                  ) : (
                    <>
                      <CalendarCheck aria-hidden="true" className="size-5" />
                      {t.reservation.submit}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
