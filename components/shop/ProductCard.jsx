'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProductCard({ product }) {
  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const { name, slug, tagline, images, price, mrp, category, isFeatured, stock } = product

  const discount = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : 0
  const img1 = images?.[0] || '/images/Sacred Botanicals.png'
  const img2 = images?.[1] || img1
  const isNew = product.createdAt
    ? Date.now() - product.createdAt.toMillis() < 30 * 24 * 3600 * 1000
    : false

  return (
    <Link
      href={`/product/${slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image ── */}
      <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-[var(--cream)] shadow-[0_8px_30px_-12px_rgba(10,53,32,0.12)] group-hover:shadow-[0_20px_50px_-15px_rgba(10,53,32,0.22)] transition-shadow duration-700">

        {/* primary image */}
        <img
          src={img1}
          alt={name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            hovered ? 'opacity-0 scale-[1.06]' : 'opacity-100 scale-100'
          } ${loaded ? '' : '!opacity-0'}`}
        />

        {/* hover image crossfade */}
        {img2 !== img1 && (
          <img
            src={img2}
            alt=""
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.06]'
            }`}
          />
        )}

        {/* shimmer placeholder */}
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--cream)] via-[var(--sand)]/30 to-[var(--cream)] animate-pulse" />
        )}

        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isFeatured && (
            <span className="px-2.5 py-1 bg-[var(--gold)]/90 backdrop-blur-sm text-white font-sans text-[9px] uppercase tracking-[0.15em] rounded-full leading-none">
              Bestseller
            </span>
          )}
          {isNew && (
            <span className="px-2.5 py-1 bg-[var(--forest)]/90 backdrop-blur-sm text-white font-sans text-[9px] uppercase tracking-[0.15em] rounded-full leading-none">
              New
            </span>
          )}
        </div>

        {/* quick-add glassmorphism overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 z-10 transition-all duration-500 ease-out ${
          hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation() }}
            className="w-full py-2.5 bg-white/75 backdrop-blur-xl text-[var(--forest)] font-sans text-[11px] uppercase tracking-[0.18em] rounded-xl border border-white/50 hover:bg-[var(--forest)] hover:text-white hover:border-[var(--forest)] transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>

        {/* out of stock */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-[var(--ink)]/35 backdrop-blur-[2px] flex items-center justify-center z-20 rounded-[1.5rem]">
            <span className="px-4 py-1.5 bg-white/90 text-[var(--ink)] font-sans text-[10px] uppercase tracking-[0.15em] rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="mt-3.5 px-1">
        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] mb-1">
          {category}
        </p>
        <h3 className="font-display text-[15px] md:text-base text-[var(--ink)] leading-snug group-hover:text-[var(--forest)] transition-colors duration-300">
          {name}
        </h3>
        {tagline && (
          <p className="font-sans text-[11px] text-[var(--muted)] mt-0.5 line-clamp-1 leading-relaxed">
            {tagline}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-display text-base md:text-lg text-[var(--forest)] font-semibold">
            ₹{price}
          </span>
          {mrp > price && (
            <>
              <span className="font-sans text-xs text-[var(--muted)] line-through">₹{mrp}</span>
              <span className="font-sans text-[9px] text-[var(--gold)] bg-[var(--gold-pale)] px-2 py-0.5 rounded-full font-medium">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}