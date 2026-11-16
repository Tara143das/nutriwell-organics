'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  // Prevent scrolling issue on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-[var(--line)]/50 rounded-[2rem] p-10 md:p-16 max-w-2xl mx-auto text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50"></div>
      
      <div className="w-24 h-24 rounded-full bg-[var(--cream)] border-2 border-[var(--gold)]/30 flex items-center justify-center mx-auto mb-8 relative">
        <div className="absolute inset-0 border border-[var(--gold)]/10 rounded-full animate-ping"></div>
        <svg className="w-10 h-10 text-[var(--forest)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <p className="font-sans text-[10px] uppercase tracking-[.3em] text-[var(--gold)] font-medium mb-3">
        Order Confirmed
      </p>
      
      <h1 className="font-display text-4xl md:text-5xl text-[var(--ink)] mb-4 tracking-tight">
        Thank You for Your <span className="italic text-[var(--forest)]">Purchase</span>
      </h1>
      
      <p className="font-sans text-[13px] text-[var(--muted)] leading-relaxed max-w-md mx-auto mb-8">
        Your holistic wellness journey begins here. We have received your order and our ancient apothecaries are carefully preparing your botanical elixirs.
      </p>

      {orderId && (
        <div className="inline-block bg-[var(--paper)] border border-[var(--line)]/50 rounded-xl px-6 py-3 mb-10">
          <p className="font-sans text-[9px] uppercase tracking-widest text-[var(--muted)] mb-1">Order Reference ID</p>
          <p className="font-sans text-sm font-semibold text-[var(--ink)] tracking-wider">#{orderId.toUpperCase().slice(0, 10)}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          href="/account"
          className="w-full sm:w-auto px-8 py-3.5 bg-[var(--forest)] text-white font-sans text-[10px] uppercase tracking-[.2em] rounded-full hover:bg-[var(--forest-deep)] transition-colors shadow-sm"
        >
          Track Order
        </Link>
        <Link 
          href="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[var(--line)] text-[var(--ink)] font-sans text-[10px] uppercase tracking-[.2em] rounded-full hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] pt-32 pb-20 px-5 relative">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[var(--cream)]/40 to-transparent -z-10"></div>
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  )
}