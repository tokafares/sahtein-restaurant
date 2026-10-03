import type { SVGProps } from 'react'

export type BrandIconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'>

/**
 * Monochrome brand glyph on the Simple Icons 24×24 grid (https://simpleicons.org, CC0).
 * Fills with currentColor and is decorative by default; pass aria-label for a standalone icon.
 */
export function BrandIcon({ path, ...props }: BrandIconProps & { path: string }) {
  const labelled = props['aria-label'] !== undefined
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={labelled ? undefined : true}
      role={labelled ? 'img' : undefined}
      focusable="false"
      {...props}
    >
      <path d={path} />
    </svg>
  )
}
