import type { MenuItemId } from './menu'

/** Quantity per menu item. Items with no entry are not in the cart. */
export type CartState = Partial<Record<MenuItemId, number>>

export type CartAction =
  | { type: 'add'; id: MenuItemId }
  | { type: 'decrement'; id: MenuItemId }
  | { type: 'remove'; id: MenuItemId }
  | { type: 'clear' }

export interface CartLine {
  id: MenuItemId
  quantity: number
  unitPrice: number
  lineTotal: number
}
