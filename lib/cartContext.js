"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nutriwell_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    } catch (e) {
      console.error("Cart localStorage load error:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nutriwell_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Cart localStorage save error:", e);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('nutriwell_cart');
    } catch (e) {}
  };

  const cartTotal = (cartItems || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider value={{ 
      cart: cartItems,          // Supports legacy `cart`
      cartItems,                // Supports `cartItems`
      cartTotal,
      subtotal: cartTotal,
      appliedCoupon,
      setAppliedCoupon,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isDrawerOpen,
      setIsDrawerOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Safe Fallback Hook: Prerender-এর সময় undefined ক্র্যাশ চিরতরে বন্ধ করবে
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      cart: [],
      cartItems: [],
      cartTotal: 0,
      subtotal: 0,
      appliedCoupon: null,
      setAppliedCoupon: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      isDrawerOpen: false,
      setIsDrawerOpen: () => {},
    };
  }
  return ctx;
};