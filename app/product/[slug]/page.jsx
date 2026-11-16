'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  collection, query, where, limit, getDocs
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useCart } from '@/lib/cartContext' // <-- Cart context import kora holo

const TABS = ['Description', 'Benefits', 'How to Use', 'Ingredients']

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params)
  const slug = unwrappedParams.slug
  
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  // Cart theke addToCart function anchi
  const { addToCart } = useCart()

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      setLoading(true)
      try {
        const snap = await getDocs(
          query(collection(db, 'products'), where('slug', '==', slug), limit(1))
        )
        if (!snap.empty) {
          const data = { id: snap.docs[0].id, ...snap.docs[0].data() }
          setProduct(data)

          // fetch related
          if (data.category) {
            const relSnap = await getDocs(
              query(
                collection(db, 'products'),
                where('category', '==', data.category),
                // where('isActive', '==', true), <-- Eta soriyechi karon amader schema te ekhon 'stock' ache
                limit(5)
              )
            )
            setRelated(
              relSnap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(p => p.slug !== slug)
                .slice(0, 4)
            )
          }
        }
      } catch (err) {
        console.error('Product fetch error:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  // ADD TO CART FUNCTIONALITY ADD KORA HOLO
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  /* ── LOADING ── */
  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--paper)] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <div className="aspect-[3/4] rounded-[2rem] bg-[var(--cream)] animate-pulse" />
            <div className="space-y-5 py-4">
              <div className="w-24 h-3 bg-[var(--cream)] rounded-full animate-pulse" />
              <div className="w-3/4 h-8 bg-[var(--cream)] rounded animate-pulse" />
              <div className="w-1/2 h-4 bg-[var(--cream)] rounded animate-pulse" />
              <div className="w-32 h-8 bg-[var(--cream)] rounded animate-pulse mt-6" />
              <div className="w-full h-28 bg-[var(--cream)] rounded-2xl animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ── NOT FOUND ── */
  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-4xl text-[var(--ink)] italic mb-3">Product not found</h1>
        <p className="font-sans text-sm text-[var(--muted)] mb-8">This remedy may have been removed or renamed.</p>
        <Link href="/shop" className="px-8 py-3 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all duration-300">
          Back to Shop
        </Link>
      </main>
    )
  }

  // Schema matching kora holo
  const { name, tagline, shortDesc, benefits, ingredients, howToUse, image, images, price, compareAtPrice, category, stock } = product
  
  const mrp = compareAtPrice || price
  const description = shortDesc || 'A premium Ayurvedic formulation.'
  
  const discount = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : 0
  const imgs = images?.length ? images : (image ? [image] : ['/images/Sacred Botanicals.png'])

  return (
    <main className="min-h-screen bg-[var(--paper)]">

      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-2">
        <nav className="flex items-center gap-2 font-sans text-[11px] text-[var(--muted)] tracking-wide">
          <Link href="/" className="hover:text-[var(--forest)] transition-colors">Home</Link>
          <span className="text-[var(--line)]">/</span>
          <Link href="/shop" className="hover:text-[var(--forest)] transition-colors">Shop</Link>
          <span className="text-[var(--line)]">/</span>
          <span className="text-[var(--ink)] font-medium">{name}</span>
        </nav>
      </div>

      {/* ── PRODUCT HERO ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* LEFT — Gallery */}
          <div className="pdp-gallery-fade">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[var(--cream)] shadow-[0_30px_60px_-30px_rgba(10,53,32,0.2)]">
              <img
                src={imgs[activeImg]}
                alt={name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[var(--gold)] text-white font-sans text-[10px] uppercase tracking-[0.15em] rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImg === i
                        ? 'border-[var(--forest)] shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div className="pdp-info-fade md:sticky md:top-28">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-2">
              {category}
            </p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[42px] text-[var(--ink)] leading-[1.12] mb-2">
              {name}
            </h1>
            {tagline && (
              <p className="font-sans text-sm text-[var(--muted)] italic leading-relaxed mb-6">
                {tagline}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl text-[var(--forest)] font-semibold">₹{price}</span>
              {mrp > price && (
                <>
                  <span className="font-sans text-base text-[var(--muted)] line-through">₹{mrp}</span>
                  <span className="font-sans text-[11px] text-[var(--gold)] bg-[var(--gold-pale)] px-2.5 py-1 rounded-full font-semibold">
                    Save ₹{mrp - price}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <p className={`font-sans text-[11px] uppercase tracking-wider mb-6 ${
              stock > 0 ? 'text-[var(--forest)]' : 'text-red-500'
            }`}>
              {stock > 0 ? `In Stock (${stock} left)` : 'Out of Stock'}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-[var(--line)] rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--cream)] transition-all duration-200 font-sans text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center font-sans text-sm font-semibold text-[var(--ink)]">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--cream)] transition-all duration-200 font-sans text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={`flex-1 py-3.5 rounded-full font-sans text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-[0_8px_25px_-8px_rgba(15,77,44,0.35)] ${
                  added
                    ? 'bg-[var(--gold)] text-white'
                    : 'bg-[var(--forest)] text-white hover:bg-[var(--forest-deep)]'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            {/* Buy Now */}
            <Link href="/checkout" onClick={handleAddToCart} className="w-full block text-center py-3.5 border-2 border-[var(--forest)] text-[var(--forest)] rounded-full font-sans text-xs uppercase tracking-[0.2em] hover:bg-[var(--forest)] hover:text-white transition-all duration-400 mb-8">
              Buy Now
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: '100% Authentic' },
                { icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z', text: 'GMP Certified' },
                { icon: 'M5 12h14M12 5l7 7-7 7', text: 'Free Shipping' },
              ].map((b, i) => (
                <div key={i} className="text-center py-3 px-2 bg-[var(--cream)]/60 rounded-2xl">
                  <svg className="w-4 h-4 mx-auto mb-1.5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                    <path d={b.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="font-sans text-[9px] uppercase tracking-wider text-[var(--muted)] leading-tight">{b.text}</p>
                </div>
              ))}
            </div>

            {/* ── TABS ── */}
            <div className="border-t border-[var(--line)] pt-6">
              <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide">
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-[11px] uppercase tracking-[0.12em] transition-all duration-300 ${
                      activeTab === i
                        ? 'bg-[var(--forest)] text-white'
                        : 'text-[var(--muted)] hover:bg-[var(--cream)]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="font-sans text-sm text-[var(--muted)] leading-relaxed min-h-[100px] pdp-tab-fade">
                {activeTab === 0 && (
                  <p>{description}</p>
                )}
                {activeTab === 1 && (
                  <ul className="space-y-2">
                    {(Array.isArray(benefits) ? benefits : ['Supports overall wellness', 'Boosts immunity naturally', 'Promotes healthy digestion']).map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--gold)] flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 2 && (
                  <p>{howToUse || 'Take 1-2 capsules daily with warm water after meals, or as directed by your Ayurvedic practitioner.'}</p>
                )}
                {activeTab === 3 && (
                  <p>{Array.isArray(ingredients) ? ingredients.join(', ') : (ingredients || 'Pure organic botanical extracts.')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
          <div className="text-center mb-10">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-2">You May Also Like</p>
            <h2 className="font-display text-2xl md:text-3xl text-[var(--ink)] italic">
              From the Same <span className="text-[var(--gold)]">Collection</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
            {related.map(p => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-[var(--cream)] shadow-[0_8px_25px_-10px_rgba(10,53,32,0.12)] group-hover:shadow-[0_16px_40px_-12px_rgba(10,53,32,0.2)] transition-shadow duration-500">
                  <img
                    src={p.image || p.images?.[0] || '/images/Sacred Botanicals.png'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                </div>
                <h3 className="font-display text-sm md:text-base text-[var(--ink)] mt-3 px-1 group-hover:text-[var(--forest)] transition-colors duration-300">{p.name}</h3>
                <p className="font-sans text-sm text-[var(--forest)] font-semibold mt-1 px-1">₹{p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── STICKY MOBILE BUY BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--paper)]/90 backdrop-blur-2xl border-t border-[var(--line)]/60 px-4 py-3 flex items-center gap-3 shadow-[0_-8px_30px_-10px_rgba(10,53,32,0.12)]">
        <div>
          <p className="font-display text-lg text-[var(--forest)] font-semibold">₹{price}</p>
          {mrp > price && <p className="font-sans text-[10px] text-[var(--muted)] line-through">₹{mrp}</p>}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`flex-1 py-3 rounded-full font-sans text-[11px] uppercase tracking-[0.18em] transition-all duration-400 ${
            added ? 'bg-[var(--gold)] text-white' : 'bg-[var(--forest)] text-white'
          }`}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </main>
  )
}