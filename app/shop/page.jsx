'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  collection, query, where, orderBy,
  limit, startAfter, getDocs
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductCard from '@/components/shop/ProductCard'

/* ─── constants ─── */
const CATEGORIES = [
  'All',
  'Sacred Botanicals',
  'Therapeutic Food',
  'Yogic Balance',
  'Cellular Defense',
]

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest Arrivals' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc',   label: 'Name: A → Z' },
]

const PER_PAGE = 8

/* ═══════════════════════════════════════════
   SHOP PAGE — Nutriwell Organics
   ═══════════════════════════════════════════ */
export default function ShopPage() {
  /* ── state ── */
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [category, setCategory]       = useState('All')
  const [sort, setSort]               = useState('featured')
  const [search, setSearch]           = useState('')
  const [lastDoc, setLastDoc]         = useState(null)
  const [hasMore, setHasMore]         = useState(true)
  const [sortOpen, setSortOpen]       = useState(false)

  const sortRef       = useRef(null)
  const searchTimer   = useRef(null)

  /* ── build firestore query ── */
  const buildQ = useCallback((cat, srt, afterDoc) => {
    const constraints = [where('isActive', '==', true)]

    if (cat !== 'All') constraints.push(where('category', '==', cat))

    let field = 'createdAt', dir = 'desc'
    if (srt === 'price-asc')  { field = 'price';     dir = 'asc'  }
    if (srt === 'price-desc') { field = 'price';     dir = 'desc' }
    if (srt === 'name-asc')   { field = 'name';      dir = 'asc'  }

    constraints.push(orderBy(field, dir), limit(PER_PAGE))
    if (afterDoc) constraints.push(startAfter(afterDoc))

    return query(collection(db, 'products'), ...constraints)
  }, [])

  /* ── fetch ── */
  const fetchProducts = useCallback(async (reset = false) => {
    reset ? setLoading(true) : setLoadingMore(true)
    if (reset) { setLastDoc(null); setHasMore(true) }

    try {
      const snap = await getDocs(buildQ(category, sort, reset ? null : lastDoc))
      let items = snap.docs.map(d => ({ id: d.id, ...d.data() }))

      /* client-side search (free plan) */
      if (search.trim()) {
        const q = search.toLowerCase()
        items = items.filter(p =>
          p.name?.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        )
      }

      /* featured first */
      if (sort === 'featured') {
        items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      }

      setProducts(prev => reset ? items : [...prev, ...items])
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null)
      setHasMore(snap.docs.length === PER_PAGE)
    } catch (err) {
      console.error('Shop fetch error:', err)
    } finally {
      setLoading(false); setLoadingMore(false)
    }
  }, [category, sort, search, lastDoc, buildQ])

  /* ── triggers ── */
  useEffect(() => { fetchProducts(true) }, [category, sort])

  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetchProducts(true), 400)
    return () => clearTimeout(searchTimer.current)
  }, [search])

  /* ── close sort on outside click ── */
  useEffect(() => {
    const handler = e => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── scroll-reveal cards ── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('shop-revealed') })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll('.shop-card-anim').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [products, loading])

  const sortLabel = SORT_OPTIONS.find(s => s.value === sort)?.label

  /* ═══════════ RENDER ═══════════ */
  return (
    <main className="min-h-screen bg-[var(--paper)]">

      {/* ──────── HERO BANNER ──────── */}
      <section className="relative h-[42vh] min-h-[320px] max-h-[500px] overflow-hidden">
        {/* bg layers */}
        <div className="absolute inset-0 bg-[var(--forest-deep)]">
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: "url('/images/Sacred Botanicals.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              filter: 'blur(1px)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--forest-deep)]/70 via-transparent to-[var(--forest-deep)]/90" />
        </div>

        {/* content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans uppercase tracking-[0.35em] text-[11px] text-[var(--gold-soft)] mb-4 shop-hero-fade" style={{ animationDelay: '0.2s' }}>
            Curated Ayurvedic Collection
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] shop-hero-fade" style={{ animationDelay: '0.4s' }}>
            Nature&rsquo;s <span className="italic text-[var(--gold-soft)]">Pharmacy</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-white/55 mt-4 max-w-md leading-relaxed shop-hero-fade" style={{ animationDelay: '0.6s' }}>
            Ancient formulations, ethically sourced, scientifically validated.
          </p>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--paper)] to-transparent z-10" />
      </section>

      {/* ──────── STICKY FILTER BAR ──────── */}
      <div className="sticky top-0 z-40 bg-[var(--paper)]/80 backdrop-blur-2xl border-b border-[var(--line)]/70">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* row 1 — search + sort */}
          <div className="flex items-center justify-between py-4 gap-3">
            {/* search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Ashwagandha, Shilajit, Triphala..."
                className="w-full pl-11 pr-4 py-2.5 bg-[var(--cream)] border border-[var(--line)] rounded-full font-sans text-[13px] text-[var(--ink)] placeholder:text-[var(--muted)]/50 placeholder:italic focus:outline-none focus:border-[var(--gold)]/60 focus:ring-1 focus:ring-[var(--gold)]/20 transition-all duration-300"
              />
            </div>

            {/* sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--cream)] border border-[var(--line)] rounded-full font-sans text-[13px] text-[var(--muted)] hover:border-[var(--gold)]/50 transition-all duration-300"
              >
                <span className="hidden sm:inline">Sort:</span>
                <span className="text-[var(--ink)] font-medium">{sortLabel}</span>
                <svg className={`w-3 h-3 text-[var(--gold)] transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[var(--line)] rounded-2xl shadow-[0_20px_50px_-15px_rgba(10,53,32,0.18)] overflow-hidden z-50 shop-dropdown">
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setSortOpen(false) }}
                      className={`w-full text-left px-5 py-3 font-sans text-[13px] transition-all duration-200 ${
                        sort === o.value
                          ? 'bg-[var(--forest)] text-white'
                          : 'text-[var(--ink)] hover:bg-[var(--cream)]'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* row 2 — category pills */}
          <div className="flex items-center gap-2 pb-4 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap px-5 py-2 rounded-full font-sans text-[11px] uppercase tracking-[0.15em] transition-all duration-400 ${
                  category === c
                    ? 'bg-[var(--forest)] text-white shadow-[0_4px_18px_-4px_rgba(15,77,44,0.45)]'
                    : 'bg-transparent border border-[var(--line)] text-[var(--muted)] hover:border-[var(--forest)]/50 hover:text-[var(--forest)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ──────── RESULTS COUNT ──────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-1">
        <p className="font-sans text-[13px] text-[var(--muted)]">
          {loading ? (
            <span className="inline-block w-36 h-4 bg-[var(--cream)] rounded animate-pulse" />
          ) : (
            <>
              Showing <span className="text-[var(--ink)] font-semibold">{products.length}</span>
              {' '}remedies
              {category !== 'All' && (
                <> in <span className="text-[var(--forest)] font-medium italic">{category}</span></>
              )}
            </>
          )}
        </p>
      </div>

      {/* ──────── PRODUCT GRID ──────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">

        {/* — LOADING SKELETONS — */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] rounded-[1.5rem] bg-gradient-to-br from-[var(--cream)] via-[var(--sand)]/40 to-[var(--cream)] animate-pulse" />
                <div className="mt-4 space-y-2.5 px-1">
                  <div className="w-16 h-2.5 bg-[var(--cream)] rounded-full animate-pulse" />
                  <div className="w-3/4 h-4 bg-[var(--cream)] rounded animate-pulse" />
                  <div className="w-1/2 h-3 bg-[var(--cream)] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* — EMPTY STATE — */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--cream)] border border-[var(--line)] flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[var(--gold)]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--ink)] italic mb-2">
              No remedies found
            </h3>
            <p className="font-sans text-sm text-[var(--muted)] max-w-sm mb-8 leading-relaxed">
              Try adjusting your search or explore our complete collection of Ayurvedic formulations.
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('All') }}
              className="px-8 py-3 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all duration-300 shadow-[0_8px_25px_-8px_rgba(15,77,44,0.4)]"
            >
              View All Products
            </button>
          </div>
        )}

        {/* — ACTUAL GRID — */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7 mt-6">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="shop-card-anim"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* load more */}
            {hasMore && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={() => fetchProducts(false)}
                  disabled={loadingMore}
                  className="group relative px-10 py-4 border-2 border-[var(--forest)] text-[var(--forest)] font-sans text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-500 hover:text-white hover:shadow-[0_12px_35px_-10px_rgba(15,77,44,0.4)] disabled:opacity-50"
                >
                  <span className="absolute inset-0 bg-[var(--forest)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
                  <span className="relative z-10 flex items-center gap-3">
                    {loadingMore ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading...
                      </>
                    ) : 'Load More Remedies'}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}