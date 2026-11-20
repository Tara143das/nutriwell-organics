'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  if (!product) return null

  const {
    id,
    name,
    slug,
    price,
    compareAtPrice,
    category,
    image,
    images,
    tagline,
    stock = 10,
    concerns = []
  } = product

  const mrp = compareAtPrice || price
  const discount = mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
  const displayImage = image || images?.[0] || '/images/Sacred Botanicals.png'

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="group relative flex flex-col justify-between h-full rounded-[2rem] bg-[var(--cream)]/40 border border-[var(--line)] hover:border-[var(--gold)]/40 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(10,53,32,0.12)]">
      
      {/* TOP IMAGE CONTAINER */}
      <div>
        <Link href={`/product/${slug}`} className="block relative aspect-[3/4] overflow-hidden bg-[var(--cream)]">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="px-2.5 py-1 bg-[var(--gold)] text-white font-sans text-[9px] font-bold uppercase tracking-wider rounded-full shadow-md">
                {discount}% OFF
              </span>
            )}
            {stock <= 5 && stock > 0 && (
              <span className="px-2.5 py-1 bg-red-950/80 backdrop-blur-md text-red-200 font-sans text-[9px] font-semibold uppercase tracking-wider rounded-full border border-red-500/30">
                Only {stock} Left
              </span>
            )}
          </div>
        </Link>

        {/* DETAILS CONTENT */}
        <div className="p-4 md:p-5 space-y-2">
          
          {/* Category & Concern */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
            <span className="font-sans font-bold text-[var(--gold)]">
              {category || 'Sacred Remedy'}
            </span>
            {concerns?.[0] && (
              <span className="font-sans text-[var(--forest)] bg-white px-2 py-0.5 rounded-full font-medium border border-[var(--line)]">
                {concerns[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/product/${slug}`} className="block group-hover:text-[var(--forest)] transition-colors">
            <h3 className="font-display text-base md:text-lg text-[var(--ink)] leading-snug line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Tagline */}
          {tagline && (
            <p className="font-sans text-[11px] text-[var(--muted)] italic line-clamp-1">
              {tagline}
            </p>
          )}

          {/* Price Box */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-lg text-[var(--forest)] font-bold">
              ₹{price}
            </span>
            {mrp > price && (
              <span className="font-sans text-xs text-[var(--muted)] line-through">
                ₹{mrp}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* QUICK ADD ACTION BUTTON */}
      <div className="p-4 md:p-5 pt-0">
        <button
          onClick={handleQuickAdd}
          disabled={stock === 0}
          className={`w-full py-3 rounded-full font-sans text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-400 shadow-md ${
            added
              ? 'bg-[var(--gold)] text-white scale-[0.98]'
              : 'bg-[var(--forest)] text-white hover:bg-[var(--forest-deep)] hover:shadow-emerald-900/20'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {added ? '✓ Added to Cart' : 'Quick Add +'}
        </button>
      </div>

    </div>
  )
}