import { MessageCircle, type LucideProps } from 'lucide-react'

/**
 * lucide-react no longer ships brand logos, so WhatsApp actions use the
 * closest neutral lucide glyph. Kept in one place so it is easy to swap.
 */
export function WhatsAppIcon(props: LucideProps) {
  return <MessageCircle aria-hidden="true" {...props} />
}
