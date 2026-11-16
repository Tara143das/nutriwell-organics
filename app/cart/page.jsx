'use client'

import { useState } from 'react'
import Link from 'next/link'

const DEMO_ITEMS = [
  {
    id: '1',
    name: 'Ashwagandha Root Extract',
    slug: 'ashwagandha-root-extract',
    image: '/images/Sacred Botanicals.png',
    price: 899,
    mrp: 1299,
    qty: 1,
    variant: '60 Capsules',
  },
  {
    id: '2',
    name: 'Shilajit Gold Resin',
    slug: 'shilajit-gold-resin',
    image: '/images/Therapeutic Food.png',
    price: 1499,
    mrp: 1999,
    qty: 2,
    variant: '20g Jar',
  },
]

export default function CartPage() {
  const [items, setItems] = useState(DEMO_ITEMS)

  const updateQty = (id, delta) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }

  const removeItem = id => setItems(prev => prev.filter(i => i.id !== id))

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const totalMrp = items.reduce((s, i) => s + i.mrp * i.qty, 0)
  const savings = totalMrp - subtotal
  const shipping = subtotal >= 999 ? 0 : 79
  const total = subtotal + shipping

  return (
    <main className="min-h-screen bg-[var(--paper)] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 font-sans text-[11px] text-[var(--muted)] tracking-wide mb-4">
            <Link href="/" className="hover:text-[var(--forest)] transition-colors">Home</Link>
            <span className="text-[var(--line)]">/</span>
            <span className="text-[var(--ink)] font-medium">Cart</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--ink)]">
            Your <span className="italic text-[var(--gold)]">Cart</span>
          </h1>
          <p className="font-sans text-sm text-[var(--muted)] mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-[var(--cream)] border border-[var(--line)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[var(--gold)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6h18" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-display text-2xl text-[var(--ink)] italic mb-2">Your cart is empty</h2>
            <p className="font-sans text-sm text-[var(--muted)] mb-8">Discover our curated Ayurvedic formulations.</p>
            <Link href="/shop" className="px-8 py-3 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-[.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all duration-300">
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Items List */}
            <div className="lg:col-span-2 space-y-5">
              {items.map(item => (
                <div key={item.id} className="flex gap-5 p-4 bg-white/50 border border-[var(--line)]/50 rounded-2xl group hover:shadow-[0_8px_30px_-12px_rgba(10,53,32,.1)] transition-shadow duration-300">
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0 w-24 h-28 md:w-28 md:h-32 rounded-xl overflow-hidden bg-[var(--cream)]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`} className="font-display text-base md:text-lg text-[var(--ink)] hover:text-[var(--forest)] transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="font-sans text-[10px] text-[var(--muted)] uppercase tracking-wider mt-0.5">{item.variant}</p>
                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-[var(--line)] rounded-full overflow-hidden">
                        <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:bg-[var(--cream)] transition-all">−</button>
                        <span className="w-8 text-center font-sans text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:bg-[var(--cream)] transition-all">+</button>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg text-[var(--forest)] font-semibold">₹{(item.price * item.qty).toLocaleString()}</p>
                        {item.mrp > item.price && <p className="font-sans text-[11px] text-[var(--muted)] line-through">₹{(item.mrp * item.qty).toLocaleString()}</p>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="self-start p-1.5 text-[var(--line)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white/50 border border-[var(--line)]/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-display text-lg text-[var(--ink)]">Order Summary</h3>

                {savings > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[var(--gold-pale)]/60 rounded-xl">
                    <span className="font-sans text-[11px] text-[var(--gold)] font-medium">
                      🎉 Saving ₹{savings.toLocaleString()}!
                    </span>
                  </div>
                )}

                <div className="space-y-2 font-sans text-[13px]">
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-[var(--forest)] font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-[var(--gold)] italic">
                      Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between text-[var(--ink)] font-semibold text-base pt-3 border-t border-[var(--line)]/40">
                    <span>Total</span>
                    <span className="font-display text-lg">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full text-center py-3.5 bg-[var(--forest)] text-white font-sans text-[11px] uppercase tracking-[.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all duration-300 shadow-[0_8px_25px_-8px_rgba(15,77,44,.35)]">
                  Proceed to Checkout
                </Link>

                <div className="flex items-center justify-center gap-4 pt-2">
                  {['GMP', 'Organic', 'Secure Pay'].map(b => (
                    <span key={b} className="font-sans text-[8px] uppercase tracking-wider text-[var(--muted)]/60">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}