const BASE = 'https://images.unsplash.com'

/** Build a cropped, auto-format Unsplash URL for a given width (and optional height). */
export function unsplash(photoId: string, width: number, height?: number): string {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(width),
    q: '75',
  })
  if (height) params.set('h', String(height))
  return `${BASE}/${photoId}?${params.toString()}`
}

/** srcset across common widths, keeping the same aspect ratio when a ratio is given. */
export function unsplashSrcSet(photoId: string, widths: readonly number[], ratio?: number): string {
  return widths
    .map((w) => `${unsplash(photoId, w, ratio ? Math.round(w / ratio) : undefined)} ${w}w`)
    .join(', ')
}
