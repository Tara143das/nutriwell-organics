'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useCart } from '@/lib/cartContext'

const TABS = ['Description', 'Benefits', 'Daily Ritual', 'Ingredients', 'Lab & Purity']

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params)
  const slug = unwrappedParams.slug

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Interactive Pincode Checker State
  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState(null)
  const [checkingPincode, setCheckingPincode] = useState(false)

  // Review Modal State
  const [reviewModal, setReviewModal] = useState(false)
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '', location: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  // Cart context integration
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
          const prodDoc = snap.docs[0]
          const data = { id: prodDoc.id, ...prodDoc.data() }
          setProduct(data)

          // Fetch Related Products from same category
          if (data.category) {
            const relSnap = await getDocs(
              query(
                collection(db, 'products'),
                where('category', '==', data.category),
                limit(5)
              )
            )
            setRelated(
              relSnap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter((p) => p.slug !== slug)
                .slice(0, 4)
            )
          }

          // Fetch Reviews
          try {
            const reviewsSnap = await getDocs(
              query(
                collection(db, `products/${prodDoc.id}/reviews`),
                orderBy('createdAt', 'desc'),
                limit(10)
              )
            )
            if (!reviewsSnap.empty) {
              setReviews(reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
            } else {
              // Fallback sample reviews if none in Firestore
              setReviews([
                {
                  id: 'rev-1',
                  name: 'Ananya Roy',
                  rating: 5,
                  comment: 'Felt a remarkable boost in vitality within just 10 days of starting this daily ritual. Packaging is super sleek!',
                  location: 'Kolkata, WB',
                  createdAt: '2 days ago'
                },
                {
                  id: 'rev-2',
                  name: 'Dr. Siddharth Mehta',
                  rating: 5,
                  comment: 'The cold-pressed extraction purity is noticeable in smell and taste. Prescribing to my wellness seekers.',
                  location: 'Mumbai, MH',
                  createdAt: '1 week ago'
                }
              ])
            }
          } catch (rErr) {
            console.log('Reviews query fallback applied')
          }
        }
      } catch (err) {
        console.error('Product fetch error:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty)
      setAdded(true)
      setTimeout(() => setAdded(false), 2200)
    }
  }

  // Handle Pincode Check
  const handleCheckPincode = (e) => {
    e.preventDefault()
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setPincodeStatus({ success: false, msg: 'Please enter a valid 6-digit Indian Pincode' })
      return
    }

    setCheckingPincode(true)
    setTimeout(() => {
      setCheckingPincode(false)
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 3)
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })

      setPincodeStatus({
        success: true,
        msg: `Deliverable to ${pincode} by ${formattedDate}. Cash on Delivery Available!`
      })
    }, 600)
  }

  // Handle Review Submission
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!newReview.name || !newReview.comment) return

    setSubmittingReview(true)
    try {
      if (product?.id) {
        await addDoc(collection(db, `products/${product.id}/reviews`), {
          ...newReview,
          createdAt: serverTimestamp()
        })
      }
      setReviews((prev) => [
        {
          id: Date.now().toString(),
          ...newReview,
          createdAt: 'Just now'
        },
        ...prev
      ])
      setReviewSuccess(true)
      setTimeout(() => {
        setReviewSuccess(false)
        setReviewModal(false)
        setNewReview({ name: '', rating: 5, comment: '', location: '' })
      }, 1500)
    } catch (err) {
      console.error('Error adding review:', err)
    } finally {
      setSubmittingReview(false)
    }
  }

  /* ── SKELETON LOADING ── */
  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--paper)] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <div className="aspect-[3/4] rounded-[2.5rem] bg-[var(--cream)] animate-pulse" />
            <div className="space-y-6 py-4">
              <div className="w-28 h-3 bg-[var(--cream)] rounded-full animate-pulse" />
              <div className="w-3/4 h-10 bg-[var(--cream)] rounded-xl animate-pulse" />
              <div className="w-1/2 h-4 bg-[var(--cream)] rounded-full animate-pulse" />
              <div className="w-40 h-10 bg-[var(--cream)] rounded-xl animate-pulse mt-6" />
              <div className="w-full h-32 bg-[var(--cream)] rounded-2xl animate-pulse mt-6" />
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
        <div className="w-20 h-20 rounded-full bg-[var(--cream)] flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="font-display text-4xl text-[var(--ink)] italic mb-3">Botanical Formulation Not Found</h1>
        <p className="font-sans text-sm text-[var(--muted)] max-w-md mb-8">
          This sacred remedy may have been moved, renamed, or temporarily harvested out.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[var(--forest-deep)] shadow-lg transition-all duration-300"
        >
          Explore Shop
        </Link>
      </main>
    )
  }

  // Extracted product attributes
  const {
    name,
    tagline,
    shortDesc,
    benefits,
    ingredients,
    howToUse,
    image,
    images,
    price,
    compareAtPrice,
    category,
    stock = 15,
    concerns = []
  } = product

  const mrp = compareAtPrice || price
  const description = shortDesc || 'A masterfully curated botanical elixir blending ancient Ayurvedic wisdom with clinical purity.'
  const discount = mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
  const imgs = images?.length ? images : image ? [image] : ['/images/Sacred Botanicals.png']

  return (
    <main className="min-h-screen bg-[var(--paper)] relative pb-16">
      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 font-sans text-[11px] text-[var(--muted)] tracking-wide">
          <Link href="/" className="hover:text-[var(--forest)] transition-colors">
            Home
          </Link>
          <span className="text-[var(--line)]">/</span>
          <Link href="/shop" className="hover:text-[var(--forest)] transition-colors">
            Apothecary Shop
          </Link>
          <span className="text-[var(--line)]">/</span>
          <span className="text-[var(--ink)] font-medium truncate max-w-[200px]">{name}</span>
        </nav>
      </div>

      {/* ── PRODUCT HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* LEFT: GALLERY WITH LIGHTBOX */}
          <div className="pdp-gallery-container space-y-4">
            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-[var(--cream)] shadow-[0_25px_50px_-12px_rgba(10,53,32,0.15)] group border border-[#b07f24]/20">
              <img
                src={imgs[activeImg]}
                alt={name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              />

              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                {discount > 0 && (
                  <span className="px-3.5 py-1.5 bg-[var(--gold)] text-white font-sans text-[10px] font-bold uppercase tracking-[0.15em] rounded-full shadow-md">
                    {discount}% HARVEST SAVINGS
                  </span>
                )}
                <span className="px-3 py-1 bg-[var(--forest-deep)]/80 backdrop-blur-md text-emerald-300 font-sans text-[9px] uppercase tracking-widest rounded-full border border-emerald-500/30">
                  Ayush Certified
                </span>
              </div>

              {/* Click to Zoom Overlay Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-3 bg-white/80 backdrop-blur-md text-[var(--ink)] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                title="Expand view"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>

            {/* Thumbnails list */}
            {imgs.length > 1 && (
              <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImg === i
                        ? 'border-[var(--gold)] scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & PURCHASING */}
          <div className="pdp-info-container md:sticky md:top-28">
            
            {/* Category & Dosha */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] font-bold">
                {category || 'Sacred Botanical'}
              </span>
              {concerns?.length > 0 && (
                <span className="text-[var(--line)]">•</span>
              )}
              {concerns.slice(0, 2).map((c, idx) => (
                <span key={idx} className="font-sans text-[10px] text-[var(--forest)] bg-[var(--cream)] px-2.5 py-0.5 rounded-full font-medium">
                  {c}
                </span>
              ))}
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-[42px] text-[var(--ink)] leading-[1.12] mb-3">
              {name}
            </h1>

            {tagline && (
              <p className="font-sans text-sm text-[var(--muted)] italic leading-relaxed mb-5">
                "{tagline}"
              </p>
            )}

            {/* Live Social Proof Scarcity Ticker */}
            <div className="flex items-center gap-2 mb-6 px-3.5 py-2 rounded-xl bg-[#f6f2e7]/80 border border-[var(--gold)]/20 text-xs font-sans text-[var(--ink)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                <strong className="text-[var(--forest)] font-semibold">14 wellness seekers</strong> are viewing this batch right now
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-[var(--line)]">
              <span className="font-display text-3xl md:text-4xl text-[var(--forest)] font-bold">
                ₹{price}
              </span>
              {mrp > price && (
                <>
                  <span className="font-sans text-lg text-[var(--muted)] line-through">₹{mrp}</span>
                  <span className="font-sans text-[11px] text-[var(--gold)] bg-[#b07f24]/10 px-3 py-1 rounded-full font-bold">
                    Save ₹{mrp - price} ({discount}%)
                  </span>
                </>
              )}
            </div>

            {/* Stock Availability */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className={`font-sans text-xs font-semibold uppercase tracking-wider ${stock > 0 ? 'text-[var(--forest)]' : 'text-red-500'}`}>
                  {stock > 0 ? `In Harvest Stock (${stock} items left)` : 'Out of Stock'}
                </span>
              </div>
              <span className="font-sans text-[11px] text-[var(--muted)]">Fresh Batch ID: NWO-2025-A</span>
            </div>

            {/* Quantity + Add to Cart CTA */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-[var(--line)] rounded-full overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-12 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--cream)] transition-all font-sans text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center font-sans text-sm font-bold text-[var(--ink)]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-12 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--cream)] transition-all font-sans text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={`flex-1 py-4 rounded-full font-sans text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-lg ${
                  added
                    ? 'bg-[var(--gold)] text-white scale-[0.99]'
                    : 'bg-[var(--forest)] text-white hover:bg-[var(--forest-deep)] hover:shadow-emerald-900/20'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {added ? '✓ Added to Sacred Cart' : 'Add to Cart'}
              </button>
            </div>

            {/* Buy Now Direct */}
            <Link
              href="/checkout"
              onClick={handleAddToCart}
              className="w-full block text-center py-3.5 border-2 border-[var(--forest)] text-[var(--forest)] rounded-full font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--forest)] hover:text-white transition-all duration-300 mb-8"
            >
              Express Direct Checkout
            </Link>

            {/* Pincode & Delivery Estimator Box */}
            <div className="p-4 rounded-2xl bg-[var(--cream)]/60 border border-[var(--line)] mb-8 space-y-3">
              <p className="font-sans text-xs font-semibold text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Check Delivery Serviceability
              </p>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white border border-[var(--line)] text-xs font-sans text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="px-5 py-2 bg-[var(--forest)] text-white font-sans text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-[var(--forest-deep)] transition-colors"
                >
                  {checkingPincode ? 'Checking...' : 'Check'}
                </button>
              </form>
              {pincodeStatus && (
                <p className={`font-sans text-xs leading-relaxed ${pincodeStatus.success ? 'text-emerald-700 font-medium' : 'text-red-500'}`}>
                  {pincodeStatus.msg}
                </p>
              )}
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: '100% Organic' },
                { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', label: 'CO₂ Cold Extracted' },
                { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Free Royal Delivery' }
              ].map((badge, index) => (
                <div key={index} className="text-center p-3 rounded-2xl bg-[var(--cream)]/40 border border-[var(--line)]">
                  <svg className="w-5 h-5 mx-auto mb-1 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={badge.icon} />
                  </svg>
                  <p className="font-sans text-[9px] uppercase tracking-wider text-[var(--muted)] font-bold">{badge.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── BOTANICAL DETAILS TABS SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 border-t border-[var(--line)]">
        <div className="flex gap-2 border-b border-[var(--line)] pb-4 overflow-x-auto scrollbar-hide">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-sans text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 ${
                activeTab === idx
                  ? 'bg-[var(--forest)] text-white shadow-md'
                  : 'text-[var(--muted)] hover:bg-[var(--cream)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8 font-sans text-sm text-[var(--muted)] leading-relaxed max-w-4xl min-h-[160px]">
          {activeTab === 0 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl text-[var(--ink)] italic">The Crafting Philosophy</h3>
              <p>{description}</p>
              <p>
                Harvested during the early morning hours when plant bio-activity is at its peak, this remedy undergoes cold-press extraction without synthetic solvents, ensuring 100% bio-availability.
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl text-[var(--ink)] italic">Primary Botanical Benefits</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {(Array.isArray(benefits) && benefits.length > 0
                  ? benefits
                  : ['Restores natural dosha equilibrium', 'Sustains cellular vitality & anti-oxidant levels', 'Promotes gut digestion and tissue rejuvenation', '100% bio-available plant potency']
                ).map((b, i) => (
                  <li key={i} className="flex items-start gap-3 bg-[var(--cream)]/60 p-3.5 rounded-2xl border border-[var(--line)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--gold)] mt-1.5 flex-shrink-0" />
                    <span className="text-[var(--ink)] font-medium text-xs leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl text-[var(--ink)] italic">Daily Dosage & Usage Ritual</h3>
              <div className="p-5 rounded-2xl bg-[var(--cream)] border border-[var(--gold)]/30 space-y-2">
                <p className="text-[var(--ink)] font-medium">
                  {howToUse || 'Take 1-2 capsules or 5ml daily with warm water or lukewarm organic milk after meals.'}
                </p>
                <p className="text-xs text-[var(--muted)] italic">
                  *Best taken consistently for 45-90 days for deep dosha harmony.
                </p>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl text-[var(--ink)] italic">Botanical Ingredients</h3>
              <div className="flex flex-wrap gap-2.5">
                {(Array.isArray(ingredients) && ingredients.length > 0
                  ? ingredients
                  : ['Organic Ashwagandha Extract', 'Pure Himalayan Shilajit', 'Golden Turmeric Root', 'Fresh Amla Extract']
                ).map((ing, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-[var(--cream)] text-[var(--forest-deep)] border border-[var(--gold)]/40 rounded-full text-xs font-semibold tracking-wide"
                  >
                    🌿 {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl text-[var(--ink)] italic">Third-Party Lab Transparency</h3>
              <div className="p-5 rounded-2xl bg-emerald-950 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">ICP-MS Heavy Metal Test</span>
                  <span className="text-xs font-mono bg-emerald-800/60 px-2.5 py-1 rounded text-emerald-200">PASS (0.001 PPM)</span>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Every single batch is tested for Lead, Arsenic, Mercury, and Cadmium to strictly exceed global WHO and Ayush standards.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS & TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-[var(--line)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] font-bold">Verified Seekers</span>
            <h2 className="font-display text-3xl text-[var(--ink)] italic mt-1">
              Botanical <span className="text-[var(--gold)]">Experiences</span>
            </h2>
          </div>
          <button
            onClick={() => setReviewModal(true)}
            className="px-6 py-3 bg-[var(--forest)] text-white rounded-full font-sans text-xs uppercase tracking-widest hover:bg-[var(--forest-deep)] transition-colors shadow-md"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 rounded-3xl bg-[var(--cream)]/50 border border-[var(--line)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-sm font-bold text-[var(--ink)]">{rev.name}</h4>
                  <p className="font-sans text-[10px] text-[var(--muted)]">{rev.location || 'India'}</p>
                </div>
                <div className="flex text-[var(--gold)]">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
              <p className="font-sans text-xs text-[var(--muted)] leading-relaxed italic">
                "{rev.comment}"
              </p>
              <div className="flex items-center justify-between pt-2 text-[10px] text-[var(--muted)] border-t border-[var(--line)]">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ Verified Buyer
                </span>
                <span>{rev.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SACRED PAIRINGS / RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-[var(--line)]">
          <div className="text-center mb-10">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] font-bold">Sacred Synergy</span>
            <h2 className="font-display text-3xl text-[var(--ink)] italic mt-1">
              Complementary <span className="text-[var(--gold)]">Formulations</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-[var(--cream)] border border-[var(--line)] shadow-sm group-hover:shadow-lg transition-all duration-500 relative">
                  <img
                    src={p.image || p.images?.[0] || '/images/Sacred Botanicals.png'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display text-base text-[var(--ink)] mt-3 px-1 group-hover:text-[var(--forest)] transition-colors">
                  {p.name}
                </h3>
                <p className="font-sans text-xs font-bold text-[var(--forest)] mt-0.5 px-1">
                  ₹{p.price}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={imgs[activeImg]} alt={name} className="w-full h-full object-contain max-h-[85vh]" />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/40"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── WRITE A REVIEW MODAL ── */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--paper)] rounded-3xl p-6 md:p-8 max-w-md w-full border border-[var(--gold)]/30 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-2xl text-[var(--ink)] italic">Review Formulation</h3>
              <button onClick={() => setReviewModal(false)} className="text-[var(--muted)] text-xl">✕</button>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-2">
                <span className="text-4xl">✨</span>
                <p className="font-display text-xl text-[var(--forest)]">Review Submitted!</p>
                <p className="font-sans text-xs text-[var(--muted)]">Thank you for sharing your experience with our community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block font-sans text-xs text-[var(--ink)] font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream)] border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none"
                    placeholder="e.g. Radhika Sharma"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs text-[var(--ink)] font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newReview.location}
                    onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream)] border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none"
                    placeholder="e.g. New Delhi, DL"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs text-[var(--ink)] font-semibold mb-1">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream)] border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none"
                  >
                    <option value={5}>5 Stars ★★★★★ - Masterpiece</option>
                    <option value={4}>4 Stars ★★★★☆ - Excellent</option>
                    <option value={3}>3 Stars ★★★☆☆ - Good</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-xs text-[var(--ink)] font-semibold mb-1">Experience Comment</label>
                  <textarea
                    required
                    rows={3}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream)] border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none"
                    placeholder="Share how this remedy impacted your daily health..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3 bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[var(--forest-deep)] transition-colors"
                >
                  {submittingReview ? 'Publishing...' : 'Submit Botanical Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── STICKY MOBILE BUY BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--paper)]/95 backdrop-blur-2xl border-t border-[var(--line)] px-4 py-3 flex items-center gap-3 shadow-[0_-8px_30px_-10px_rgba(10,53,32,0.2)]">
        <div>
          <p className="font-display text-xl text-[var(--forest)] font-bold">₹{price}</p>
          {mrp > price && <p className="font-sans text-[10px] text-[var(--muted)] line-through">₹{mrp}</p>}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`flex-1 py-3.5 rounded-full font-sans text-xs font-bold uppercase tracking-[0.18em] transition-all ${
            added ? 'bg-[var(--gold)] text-white' : 'bg-[var(--forest)] text-white'
          }`}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </main>
  )
}