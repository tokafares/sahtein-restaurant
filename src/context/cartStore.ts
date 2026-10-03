import { createContext } from 'react'
import { MENU_ITEM_IDS, type MenuItemId } from '../types/menu'
import type { CartAction, CartLine, CartState } from '../types/cart'

export const CART_STORAGE_KEY = 'sahtein:cart'
const MAX_QUANTITY = 20

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const current = state[action.id] ?? 0
      return { ...state, [action.id]: Math.min(current + 1, MAX_QUANTITY) }
    }
    case 'decrement': {
      const current = state[action.id] ?? 0
      if (current <= 1) {
        const next = { ...state }
        delete next[action.id]
        return next
      }
      return { ...state, [action.id]: current - 1 }
    }
    case 'remove': {
      const next = { ...state }
      delete next[action.id]
      return next
    }
    case 'clear':
      return {}
  }
}

function isMenuItemId(value: string): value is MenuItemId {
  return (MENU_ITEM_IDS as readonly string[]).includes(value)
}

/** Parse persisted cart JSON defensively: unknown ids and bad quantities are dropped. */
export function parseCart(raw: string | null): CartState {
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const state: CartState = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (isMenuItemId(key) && typeof value === 'number' && Number.isInteger(value) && value > 0) {
        state[key] = Math.min(value, MAX_QUANTITY)
      }
    }
    return state
  } catch {
    return {}
  }
}

export interface CartContextValue {
  lines: readonly CartLine[]
  count: number
  total: number
  quantityOf: (id: MenuItemId) => number
  add: (id: MenuItemId) => void
  decrement: (id: MenuItemId) => void
  remove: (id: MenuItemId) => void
  clear: () => void
  isOpen: boolean
  open: () => void
  close: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
