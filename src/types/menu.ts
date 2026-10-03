export const MENU_CATEGORIES = ['breakfast', 'mains', 'grills', 'desserts', 'drinks'] as const
export type MenuCategoryId = (typeof MENU_CATEGORIES)[number]

export const MENU_ITEM_IDS = [
  'falafel',
  'shakshuka',
  'hummusBeiruti',
  'sahteinBreakfast',
  'koshari',
  'warakEnab',
  'lentilSoup',
  'tagenLahma',
  'shishTawook',
  'kofta',
  'lambChops',
  'mixedGrill',
  'kunafa',
  'baklava',
  'basbousa',
  'omAli',
  'karkadeh',
  'mintLemonade',
  'turkishCoffee',
  'asab',
] as const
export type MenuItemId = (typeof MENU_ITEM_IDS)[number]

export type MenuTag = 'popular' | 'vegetarian' | 'spicy'

export interface MenuItem {
  id: MenuItemId
  category: MenuCategoryId
  /** Price in Egyptian pounds */
  price: number
  /** Unsplash photo id, e.g. "photo-1593001872095-7d5b3868fb1d" */
  image: string
  tags: readonly MenuTag[]
}
