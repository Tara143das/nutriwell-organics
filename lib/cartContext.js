'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nwo_cart_items')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('nwo_cart_items', JSON.stringify(cart))
      } catch (err) {
        console.error('Failed to save cart to localStorage:', err)
      }
    }
  }, [cart, isInitialized])

  // Drawer Controls
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const toggleCart = () => setIsCartOpen((prev) => !prev)

  // Add Item to Cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id)

      if (existingIndex > -1) {
        const updated = [...prevCart]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        }
        return updated
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price) || 0,
            compareAtPrice: Number(product.compareAtPrice) || Number(product.price) || 0,
            image: product.image || product.images?.[0] || '/images/Sacred Botanicals.png',
            category: product.category || 'Botanical Remedy',
            quantity: quantity
          }
        ]
      }
    })

    // Automatically open drawer on add
    setIsCartOpen(true)
  }

  // Remove Item from Cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  // Update Item Quantity
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    )
  }

  // Clear Entire Cart
  const clearCart = () => {
    setCart([])
    try {
      localStorage.removeItem('nwo_cart_items')
    } catch (err) {
      console.error('Failed to clear cart localStorage:', err)
    }
  }

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}