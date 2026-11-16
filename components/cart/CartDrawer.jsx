'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'

export default function CartDrawer({ open, onClose }) {
  const router = useRouter()
  const { cartItems, updateQty, removeItem, subtotal } = useCart()

  if (!open) return null

  const totalMrp = cartItems.reduce((acc, item) => acc + (item.mrp || item.price) * item.qty, 0)
  const savings = totalMrp - subtotal
  const freeShippingThreshold = 999
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 79
  const grandTotal = subtotal + shipping

  const handleProceedToCheckout = () => {
    onClose() // Drawer close hobe
    router.push('/checkout') // Checkout page-e redirect hobe
  }

  const handleContinueShopping = () => {
    onClose() // Drawer close hobe
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--paper)] border-l border-[var(--line)]/50 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--line)]/50 flex items-center justify-between bg-white/40">
            <div>
              <h2 className="font-display text-xl text-[var(--ink)]">
                Your <span className="italic text-[var(--gold)]">Cart</span>
              </h2>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[var(--muted)]">
                {cartItems.reduce((a, b) => a + b.qty, 0)} items
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors rounded-full"
              aria-label="Close Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--cream)] border border-[var(--line)]/40 flex items-center justify-center text-[var(--gold)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-display text-lg text-[var(--ink)] italic">Your cart is empty</p>
                <p className="font-sans text-xs text-[var(--muted)]">Discover our ancient Ayurvedic formulations.</p>
                <button
                  onClick={() => {
                    onClose()
                    router.push('/shop')
                  }}
                  className="mt-4 px-6 py-2.5 bg-[var(--forest)] text-white font-sans text-[10px] uppercase tracking-widest rounded-full hover:bg-[var(--forest-deep)] transition-colors shadow-sm"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="flex gap-4 p-3 bg-white/60 border border-[var(--line)]/50 rounded-2xl relative group hover:border-[var(--gold)]/40 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-xl bg-[var(--cream)] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-sm text-[var(--ink)] truncate">{item.name}</h4>
                      <p className="font-sans text-[9px] uppercase tracking-wider text-[var(--muted)]">{item.variant}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[var(--line)] rounded-full overflow-hidden bg-white">
                        <button
                          onClick={() => updateQty(item.id, -1, item.variant)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-[var(--muted)] hover:bg-[var(--cream)]"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-sans text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1, item.variant)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-[var(--muted)] hover:bg-[var(--cream)]"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-display text-sm font-semibold text-[var(--forest)]">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.variant)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors self-start"
                    aria-label="Remove Item"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary & Actions */}
          {cartItems.length > 0 && (
            <div className="px-6 py-6 border-t border-[var(--line)]/50 bg-white/60 space-y-4">
              {savings > 0 && (
                <div className="p-2.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-xl text-center">
                  <p className="font-sans text-[10px] text-[var(--gold)] font-medium">
                    🎉 You're saving ₹{savings.toLocaleString()} on this order!
                  </p>
                </div>
              )}
              
              <div className="space-y-1.5 font-sans text-xs text-[var(--muted)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[var(--ink)] font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-[var(--forest)] font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[var(--ink)] font-bold pt-2 border-t border-[var(--line)]/30">
                  <span>Total</span>
                  <span className="font-display text-base text-[var(--forest)]">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-[var(--forest)] text-white font-sans text-[11px] uppercase tracking-[.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all duration-300 shadow-md text-center block"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="w-full text-center font-sans text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-2 block"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}