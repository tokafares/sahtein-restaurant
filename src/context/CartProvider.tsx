import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { menuItems } from '../data/menu'
import { readStorage, writeStorage } from '../lib/storage'
import type { CartLine } from '../types/cart'
import type { MenuItemId } from '../types/menu'
import { CART_STORAGE_KEY, CartContext, cartReducer, parseCart, type CartContextValue } from './cartStore'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, null, () => parseCart(readStorage(CART_STORAGE_KEY)))
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    writeStorage(CART_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const add = useCallback((id: MenuItemId) => dispatch({ type: 'add', id }), [])
  const decrement = useCallback((id: MenuItemId) => dispatch({ type: 'decrement', id }), [])
  const remove = useCallback((id: MenuItemId) => dispatch({ type: 'remove', id }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartContextValue>(() => {
    // Keep menu order so the cart reads like the menu
    const lines: CartLine[] = []
    for (const item of menuItems) {
      const quantity = state[item.id]
      if (quantity) lines.push({ id: item.id, quantity, unitPrice: item.price, lineTotal: quantity * item.price })
    }
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      quantityOf: (id) => state[id] ?? 0,
      add,
      decrement,
      remove,
      clear,
      isOpen,
      open,
      close,
    }
  }, [state, isOpen, add, decrement, remove, clear, open, close])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
