import { useContext } from 'react'
import { CartContext, type CartContextValue } from './cartStore'

export function useCart(): CartContextValue {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used inside <CartProvider>')
  return value
}
