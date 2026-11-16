'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const defaultCartState = {
  cartItems: [],
  addToCart: () => {},
  updateQty: () => {},
  removeItem: () => {},
  clearCart: () => {},
  cartCount: 0,
  subtotal: 0,
}

const CartContext = createContext(defaultCartState)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nutriwell_cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (err) {
      console.error('Failed to load cart from storage:', err)
    } font
      setIsLoaded(true)
  }, [])

  // Sync cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('nutriwell_cart', JSON.stringify(cartItems))
      } catch (err) {
        console.error('Failed to save cart to storage:', err)
      }
    }
  }, [cartItems, isLoaded])

  const addToCart = (product, qty = 1, variant = 'Standard') => {
    if (!product) return
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.variant === variant
      )
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].qty += qty
        return updated
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name || 'Botanical Remedy',
          slug: product.slug || 'product',
          image:
            product.image ||
            product.images?.[0] ||
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80',
          price: Number(product.price) || 0,
          mrp: Number(product.compareAtPrice || product.price) || 0,
          qty: qty,
          variant: variant,
        },
      ]
    })
  }

  const updateQty = (id, delta, variant = 'Standard') => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.variant === variant
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    )
  }

  const removeItem = (id, variant = 'Standard') => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.variant === variant))
    )
  }

  const clearCart = () => setCartItems([])

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    return defaultCartState
  }
  return context
}