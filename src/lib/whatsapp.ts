import { WHATSAPP_NUMBER } from '../data/site'
import type { Formatters } from '../i18n/context'
import type { CartLine } from '../types/cart'
import type { Translations } from '../types/i18n'

export function buildOrderMessage(lines: readonly CartLine[], total: number, t: Translations, fmt: Formatters): string {
  const body = lines.map((line) =>
    t.cart.message.line(fmt.number(line.quantity), t.menu.items[line.id].name, fmt.price(line.lineTotal)),
  )
  return [t.cart.message.greeting, '', ...body, '', t.cart.message.total(fmt.price(total)), t.cart.message.closing].join(
    '\n',
  )
}

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
