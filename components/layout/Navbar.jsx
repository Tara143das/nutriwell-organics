'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartDrawer from '@/components/cart/CartDrawer'
import { useAuth } from '@/lib/auth' // <-- Added Auth Hook

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false) // <-- Added Dropdown State
  
  const pathname = usePathname()
  const lastY = useRef(0)
  const searchRef = useRef(null)

  // Auth Data
  const { user, role, logout, isAdmin, isEmployee } = useAuth()

  /* ── scroll: hide on down, show on up ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      setHidden(y > 250 && y > lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── close on route change ── */
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setCartOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  /* ── lock body ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, searchOpen])

  /* ── focus search ── */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 350)
  }, [searchOpen])

  /* ── ESC ── */
  useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMobileOpen(false)
        setUserMenuOpen(false)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const isHome = pathname === '/'
  const clear = isHome && !scrolled && !mobileOpen && !searchOpen

  // Determine Dashboard Link based on Role
  const dashboardLink = isAdmin ? '/admin/dashboard' : isEmployee ? '/employee/dashboard' : '/account'

  return (
    <>
      {/* ═══════════ MAIN NAV ═══════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        clear
          ? 'bg-transparent'
          : 'bg-[var(--paper)]/80 backdrop-blur-2xl border-b border-[var(--line)]/40 shadow-[0_1px_30px_-10px_rgba(10,53,32,.06)]'
      }`}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between h-[68px] md:h-[76px]">

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-baseline gap-1">
            <span className={`font-display text-[22px] md:text-[26px] font-medium tracking-tight transition-colors duration-400 ${
              clear ? 'text-white' : 'text-[var(--ink)]'
            }`}>
              Nutri<span className="italic font-normal text-[var(--gold)]">well</span>
            </span>
            <span className={`hidden sm:inline font-sans text-[7px] uppercase tracking-[.35em] ml-1 transition-colors duration-400 ${
              clear ? 'text-white/40' : 'text-[var(--muted)]/60'
            }`}>Organics</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map(link => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link key={link.href} href={link.href}
                  className={`relative font-sans text-[11px] uppercase tracking-[.2em] py-1 transition-colors duration-300 ${
                    clear
                      ? active ? 'text-white' : 'text-white/55 hover:text-white/90'
                      : active ? 'text-[var(--forest)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[var(--gold)] rounded-full transition-all duration-400 ${active ? 'w-full' : 'w-0'}`} />
                </Link>
              )
            })}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Search */}
            <button onClick={() => setSearchOpen(true)}
              className={`p-2.5 rounded-full transition-colors duration-300 ${
                clear ? 'text-white/65 hover:text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`} aria-label="Search">
              <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist"
              className={`hidden md:flex p-2.5 rounded-full transition-colors duration-300 ${
                clear ? 'text-white/65 hover:text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`} aria-label="Wishlist">
              <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* Cart — opens drawer */}
            <button onClick={() => setCartOpen(true)}
              className={`relative p-2.5 rounded-full transition-colors duration-300 ${
                clear ? 'text-white/65 hover:text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`} aria-label="Cart">
              <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6h18" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="absolute top-1 right-1 w-[15px] h-[15px] bg-[var(--gold)] text-white font-sans text-[8px] font-bold rounded-full flex items-center justify-center leading-none">0</span>
            </button>

            {/* Account / User Dropdown */}
            {user ? (
              <div className="relative hidden sm:block ml-1">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-[10px] uppercase tracking-[.15em] transition-all duration-400 ${
                    clear
                      ? 'border border-[var(--gold)]/40 bg-black/20 text-white/90 hover:bg-black/40'
                      : 'border border-[var(--gold)]/30 bg-[var(--cream)]/50 text-[var(--ink)] hover:border-[var(--gold)]'
                  }`}
                >
                  Welcome, 
                  <span className="text-[var(--gold)] font-bold tracking-widest [text-shadow:0_0_12px_rgba(176,127,36,0.8)]">
                    {user.displayName?.split(' ')[0] || user.email.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 mt-3 w-56 bg-[var(--paper)] border border-[var(--line)]/40 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-5 py-3 border-b border-[var(--line)]/30">
                      <p className="font-display text-sm text-[var(--ink)]">{user.displayName || 'Customer'}</p>
                      <p className="font-sans text-[9px] text-[var(--muted)] truncate">{user.email}</p>
                    </div>
                    
                    <Link href={dashboardLink} onClick={() => setUserMenuOpen(false)} className="block px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest text-[var(--ink)] hover:bg-[var(--cream)] transition-colors mt-1">
                      {isAdmin || isEmployee ? 'Management Portal' : 'My Dashboard'}
                    </Link>
                    <Link href="/cart" onClick={() => setUserMenuOpen(false)} className="block px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest text-[var(--ink)] hover:bg-[var(--cream)] transition-colors">
                      Checkout
                    </Link>
                    
                    <div className="border-t border-[var(--line)]/30 my-1"></div>
                    
                    <button onClick={() => { setUserMenuOpen(false); logout(); }} className="w-full text-left px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login"
                className={`hidden sm:flex items-center gap-1.5 ml-1 px-4 py-2 rounded-full font-sans text-[10px] uppercase tracking-[.18em] transition-all duration-400 ${
                  clear
                    ? 'border border-white/25 text-white/70 hover:bg-white/10 hover:text-white'
                    : 'border border-[var(--line)] text-[var(--muted)] hover:border-[var(--forest)]/50 hover:text-[var(--forest)]'
                }`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Account
              </Link>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2.5 rounded-full transition-colors duration-300 ${
                clear && !mobileOpen ? 'text-white' : 'text-[var(--ink)]'
              }`} aria-label="Menu">
              <div className="w-[18px] h-[14px] relative flex flex-col justify-between">
                <span className={`block h-[1.5px] rounded-full bg-current transition-all duration-400 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.25px]' : ''}`}/>
                <span className={`block h-[1.5px] rounded-full bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`}/>
                <span className={`block h-[1.5px] rounded-full bg-current transition-all duration-400 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.25px]' : ''}`}/>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════ SEARCH OVERLAY ═══════════ */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${searchOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-[var(--ink)]/60 backdrop-blur-md transition-opacity duration-500 ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => { setSearchOpen(false); setSearchQuery('') }}/>
        <div className={`relative max-w-2xl mx-auto mt-[18vh] px-6 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}>
          <div className="bg-[var(--paper)] rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,.4)] overflow-hidden">
            <div className="flex items-center gap-4 px-7 py-5 border-b border-[var(--line)]/50">
              <svg className="w-5 h-5 text-[var(--gold)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5" strokeLinecap="round"/>
              </svg>
              <input ref={searchRef} type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Ashwagandha, Shilajit, Triphala..."
                className="flex-1 bg-transparent font-display text-xl md:text-2xl text-[var(--ink)] placeholder:text-[var(--muted)]/40 placeholder:italic focus:outline-none"/>
              <button onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="px-7 py-5">
              <p className="font-sans text-[10px] uppercase tracking-[.25em] text-[var(--muted)] mb-3">Trending</p>
              <div className="flex flex-wrap gap-2">
                {['Ashwagandha','Shilajit','Triphala','Brahmi','Turmeric','Amla'].map(t => (
                  <Link key={t} href={`/shop?search=${t.toLowerCase()}`}
                    onClick={() => setSearchOpen(false)}
                    className="px-4 py-1.5 bg-[var(--cream)] border border-[var(--line)]/60 rounded-full font-sans text-[12px] text-[var(--muted)] hover:bg-[var(--forest)] hover:text-white hover:border-[var(--forest)] transition-all duration-300">
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center font-sans text-[10px] text-white/30 mt-4 tracking-wider">
            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 text-[9px]">ESC</kbd> to close
          </p>
        </div>
      </div>

      {/* ═══════════ MOBILE MENU ═══════════ */}
      <div className={`fixed inset-0 z-[55] lg:hidden transition-all duration-500 ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-[var(--paper)] transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col h-full pt-28 px-8 pb-12">
            <div className="flex-1">
              {NAV_LINKS.map((link, i) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-display text-[32px] md:text-[40px] text-[var(--ink)] py-3 border-b border-[var(--line)]/40 transition-all duration-500 ${
                    mobileOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                  }`}
                  style={{ transitionDelay: mobileOpen ? `${i * 70 + 100}ms` : '0ms' }}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-4 pt-6">
              {user ? (
                <>
                  <Link href={dashboardLink}
                    onClick={() => setMobileOpen(false)}
                    className={`block w-full text-center py-4 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-[.2em] rounded-full transition-all duration-500 ${
                      mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                    style={{ transitionDelay: mobileOpen ? '450ms' : '0ms' }}>
                    My Dashboard
                  </Link>
                  <button onClick={() => { setMobileOpen(false); logout(); }}
                    className={`block w-full text-center py-4 border border-[var(--line)] text-[var(--ink)] font-sans text-xs uppercase tracking-[.2em] rounded-full transition-all duration-500 ${
                      mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                    style={{ transitionDelay: mobileOpen ? '500ms' : '0ms' }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={`block w-full text-center py-4 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-[.2em] rounded-full transition-all duration-500 ${
                    mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: mobileOpen ? '450ms' : '0ms' }}>
                  My Account
                </Link>
              )}
              <p className={`text-center font-sans text-[10px] text-[var(--muted)] tracking-[.2em] uppercase transition-all duration-500 ${
                mobileOpen ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: mobileOpen ? '550ms' : '0ms' }}>
                Ancient Healing · Modern Wellness
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ CART DRAWER ═══════════ */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}