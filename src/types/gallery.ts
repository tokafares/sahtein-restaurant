export const GALLERY_IMAGE_IDS = [
  'mezzeTable',
  'charcoalSkewers',
  'koshariSpoon',
  'arabicCoffee',
  'baklavaTrays',
  'hummusPita',
  'spiceStall',
  'skilletEggs',
  'mixedPlate',
  'feastSpread',
] as const
export type GalleryImageId = (typeof GALLERY_IMAGE_IDS)[number]

export interface GalleryImage {
  id: GalleryImageId
  image: string
  /** Intrinsic aspect ratio (width / height) used for masonry layout */
  ratio: number
}
