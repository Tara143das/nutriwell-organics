'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductCard from '@/components/shop/ProductCard'

/* ─── CONSTANTS ─── */
const CATEGORIES = [
  'All',
  'Sacred Botanicals',
  'Therapeutic Food',
  'Yogic Balance',
  'Cellular Defense'
]

const CONCERNS = [
  'All Concerns',
  'Gut Harmony',
  'Hair Roots',
  'Daily Immunity',
  'Deep Sleep',
  'Radiant Skin'
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Curated Featured' },
  { value: 'newest', label: 'Newest Harvest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc', label: 'Alphabetical: A → Z' }
]

const PER_PAGE = 8

export default function ShopPage() {
  /* ── STATE ── */
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [category, setCategory] = useState('All')
  const [selectedConcern, setSelectedConcern] = useState('All Concerns')
  const [sort, setSort] = useState('featured')
  const [search, setSearch] = useState('')
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [sortOpen, setSortOpen] = useState(false)
  const [concernOpen, setConcernOpen] = useState(false)

  const sortRef = useRef(null)
  const concernRef = useRef(null)
  const searchTimer = useRef(null)

  /* ── BUILD FIRESTORE QUERY WITH FALLBACK RESILIENCE ── */
  const fetchProducts = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true)
      setLastDoc(null)
      setHasMore(true)
    } else {
      setLoadingMore(true)
    }

    try {
      // Base constraints
      const constraints = []

      if (category !== 'All') {
        constraints.push(where('category', '==', category))
      }

      let field = 'createdAt', dir = 'desc'
      if (sort === 'price-asc') { field = 'price'; dir = 'asc' }
      if (sort === 'price-desc') { field = 'price'; dir = 'desc' }
      if (sort === 'name-asc') { field = 'name'; dir = 'asc' }

      // Try index query
      let q
      try {
        const queryArgs = [...constraints]
        if (field) queryArgs.push(orderBy(field, dir))
        queryArgs.push(limit(PER_PAGE * 2)) // Fetch slightly larger window for client filtering
        if (!reset && lastDoc) queryArgs.push(startAfter(lastDoc))

        q = query(collection(db, 'products'), ...queryArgs)
      } catch (qErr) {
        q = query(collection(db, 'products'), limit(30))
      }

      const snap = await getDocs(q)
      let items = snap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Filter active products
      items = items.filter(p => p.isActive !== false)

      // Filter by concern if selected
      if (selectedConcern !== 'All Concerns') {
        items = items.filter(p => 
          Array.isArray(p.concerns) 
            ? p.concerns.includes(selectedConcern) 
            : p.concern === selectedConcern
        )
      }

      // Client-side search filtering
      if (search.trim()) {
        const searchTerm = search.toLowerCase()
        items = items.filter(p =>
          p.name?.toLowerCase().includes(searchTerm) ||
          p.tagline?.toLowerCase().includes(searchTerm) ||
          p.category?.toLowerCase().includes(searchTerm) ||
          (Array.isArray(p.ingredients) && p.ingredients.some(i => i.toLowerCase().includes(searchTerm)))
        )
      }

      // Client-side sorting fallback
      if (sort === 'featured') {
        items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      } else if (sort === 'price-asc') {
        items.sort((a, b) => (a.price || 0) - (b.price || 0))
      } else if (sort === 'price-desc') {
        items.sort((a, b) => (b.price || 0) - (a.price || 0))
      } else if (sort === 'name-asc') {
        items.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      }

      const paginatedItems = items.slice(0, PER_PAGE)

      setProducts(prev => reset ? paginatedItems : [...prev, ...paginatedItems])
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null)
      setHasMore(items.length > PER_PAGE)
    } catch (err) {
      console.error('Shop fetch error:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [category, selectedConcern, sort, search, lastDoc])

  /* ── TRIGGERS ── */
  useEffect(() => {
    fetchProducts(true)
  }, [category, selectedConcern, sort])

  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetchProducts(true), 400)
    return () => clearTimeout(searchTimer.current)
  }, [search])

  /* ── OUTSIDE CLICK LISTENERS FOR DROPDOWNS ── */
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
      if (concernRef.current && !concernRef.current.contains(e.target)) setConcernOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── SCROLL REVEAL CARDS HOOK ── */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('shop-revealed') })
    }, { threshold: 0.08 })

    document.querySelectorAll('.shop-card-anim').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [products, loading])

  const currentSortLabel = SORT_OPTIONS.find(s => s.value === sort)?.label

  return (
    <main className="min-h-screen bg-[var(--paper)]">

      {/* ──────── HERO BANNER ──────── */}
      <section className="relative h-[44vh] min-h-[340px] max-h-[520px] overflow-hidden">
        <div className="absolute inset-0 bg-[var(--forest-deep)]">
          <div
            className="absolute inset-0 opacity-[0.22] scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: "url('/images/Sacred Botanicals.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              filter: 'blur(1px)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--forest-deep)]/80 via-transparent to-[var(--forest-deep)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-12">
          <span className="font-sans uppercase tracking-[0.35em] text-[10px] md:text-[11px] text-[var(--gold)] mb-3 font-semibold">
            Pure Botanical Apothecary
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08]">
            Nature's <span className="italic text-[var(--gold)] font-serif">Pharmacy</span>
          </h1>
          <p className="font-sans text-xs md:text-sm text-emerald-100/70 mt-4 max-w-md leading-relaxed">
            Ancient Ayurvedic formulations, ethically harvested in peak seasons, cold-extracted with zero synthetic additives.
          </p>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--paper)] to-transparent z-10" />
      </section>

      {/* ──────── STICKY TOOLBAR (SEARCH + FILTERS + SORT) ──────── */}
      <div className="sticky top-0 z-40 bg-[var(--paper)]/95 backdrop-blur-2xl border-b border-[var(--line)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 space-y-3">

          {/* ROW 1: SEARCH + CONCERN FILTER + SORT */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
                <path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Ashwagandha, Shilajit, Gut, Hair..."
                className="w-full pl-11 pr-10 py-2.5 bg-[var(--cream)] border border-[var(--line)] rounded-full font-sans text-xs text-[var(--ink)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:border-[var(--gold)] transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              
              {/* Concern Filter Dropdown */}
              <div className="relative" ref={concernRef}>
                <button
                  onClick={() => setConcernOpen(!concernOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--cream)] border border-[var(--line)] rounded-full font-sans text-xs text-[var(--ink)] hover:border-[var(--gold)]/60 transition-all"
                >
                  <span className="text-[var(--muted)] hidden sm:inline">Concern:</span>
                  <span className="font-semibold text-[var(--forest)]">{selectedConcern}</span>
                  <svg className={`w-3 h-3 text-[var(--gold)] transition-transform ${concernOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {concernOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[var(--line)] rounded-2xl shadow-xl overflow-hidden z-50">
                    {CONCERNS.map(c => (
                      <button
                        key={c}
                        onClick={() => { setSelectedConcern(c); setConcernOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 font-sans text-xs transition-colors ${
                          selectedConcern === c
                            ? 'bg-[var(--forest)] text-white font-semibold'
                            : 'text-[var(--ink)] hover:bg-[var(--cream)]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--cream)] border border-[var(--line)] rounded-full font-sans text-xs text-[var(--ink)] hover:border-[var(--gold)]/60 transition-all"
                >
                  <span className="text-[var(--muted)] hidden sm:inline">Sort:</span>
                  <span className="font-semibold">{currentSortLabel}</span>
                  <svg className={`w-3 h-3 text-[var(--gold)] transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[var(--line)] rounded-2xl shadow-xl overflow-hidden z-50">
                    {SORT_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        onClick={() => { setSort(o.value); setSortOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 font-sans text-xs transition-colors ${
                          sort === o.value
                            ? 'bg-[var(--forest)] text-white font-semibold'
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
          </div>

          {/* ROW 2: CATEGORY PILL TABS */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-1 pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full font-sans text-[11px] uppercase tracking-[0.14em] font-semibold transition-all ${
                  category === cat
                    ? 'bg-[var(--forest)] text-white shadow-md'
                    : 'bg-transparent border border-[var(--line)] text-[var(--muted)] hover:border-[var(--forest)] hover:text-[var(--forest)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ──────── ACTIVE FILTER RECAP BAR ──────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-2 flex flex-wrap items-center justify-between gap-3 font-sans text-xs text-[var(--muted)]">
        <div>
          {loading ? (
            <span className="inline-block w-40 h-4 bg-[var(--cream)] rounded animate-pulse" />
          ) : (
            <span>
              Showing <strong className="text-[var(--ink)] font-semibold">{products.length}</strong> formulations
              {category !== 'All' && <> in <span className="text-[var(--forest)] font-semibold">{category}</span></>}
              {selectedConcern !== 'All Concerns' && <> for <span className="text-[var(--gold)] font-semibold">{selectedConcern}</span></>}
            </span>
          )}
        </div>

        {(category !== 'All' || selectedConcern !== 'All Concerns' || search) && (
          <button
            onClick={() => { setCategory('All'); setSelectedConcern('All Concerns'); setSearch('') }}
            className="text-[var(--gold)] hover:underline font-semibold"
          >
            Reset All Filters ↺
          </button>
        )}
      </div>

      {/* ──────── PRODUCT GRID SECTION ──────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24 pt-4">

        {/* LOADING SKELETON GRID */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] rounded-[2rem] bg-[var(--cream)] animate-pulse" />
                <div className="w-1/3 h-3 bg-[var(--cream)] rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-[var(--cream)] rounded animate-pulse" />
                <div className="w-1/2 h-3 bg-[var(--cream)] rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--cream)] border border-[var(--line)] flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--ink)] italic mb-2">
              No Sacred Remedies Found
            </h3>
            <p className="font-sans text-xs text-[var(--muted)] max-w-sm mb-8 leading-relaxed">
              We couldn't find any formulation matching your current filters. Try relaxing your search criteria.
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setSelectedConcern('All Concerns') }}
              className="px-8 py-3 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-widest rounded-full hover:bg-[var(--forest-deep)] shadow-lg transition-all"
            >
              Explore Complete Apothecary
            </button>
          </div>
        )}

        {/* ACTUAL PRODUCTS GRID */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="shop-card-anim transition-all duration-500"
                  style={{ transitionDelay: `${(i % 4) * 60}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* LOAD MORE BUTTON */}
            {hasMore && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={() => fetchProducts(false)}
                  disabled={loadingMore}
                  className="px-10 py-3.5 border-2 border-[var(--forest)] text-[var(--forest)] font-sans text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[var(--forest)] hover:text-white transition-all shadow-md disabled:opacity-50"
                >
                  {loadingMore ? 'Retrieving Formulations...' : 'Load More Sacred Remedies'}
                </button>
              </div>
            )}
          </>
        )}

      </section>
    </main>
  )
}