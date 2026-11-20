'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartDrawer from '@/components/cart/CartDrawer'
import { useAuth } from '@/lib/auth'

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/shop', label: 'SHOP' },
  { href: '/about', label: 'OUR STORY' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const pathname = usePathname()
  const searchRef = useRef(null)

  // Auth Hook
  const { user, role, logout, isAdmin, isEmployee } = useAuth()

  /* ── close on route change ── */
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setCartOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  /* ── lock body scroll ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, searchOpen])

  /* ── focus search ── */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 350)
  }, [searchOpen])

  /* ── ESC key listener ── */
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

  const dashboardLink = isAdmin ? '/admin/dashboard' : isEmployee ? '/employee/dashboard' : '/account'

  return (
    <>
      {/* ═══════════ MAIN NAV (FIXED LUXURY IVORY POTTI) ═══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fbf9f4]/95 backdrop-blur-xl border-b border-[#b07f24]/30 shadow-[0_4px_30px_rgba(15,77,44,0.08)] transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between h-[74px] md:h-[82px]">
          
          {/* Logo (Sharp & Crisp) */}
          <Link href="/" className="relative z-10 flex items-center gap-2 group py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Nutriwell Organics"
              className="h-11 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = "/logo1.svg"
              }}
            />
          </Link>

          {/* 
            Desktop Links: 
            - Bold & Big (text-[15px] md:text-[16px] font-bold)
            - Tighter letter-spacing (tracking-[0.08em]) jate font fete na jay
            - Crisp antialiased rendering
          */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-11">
            {NAV_LINKS.map(link => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-sans text-[14px] md:text-[15px] font-bold tracking-[0.08em] py-2 transition-all duration-300 antialiased ${
                    active
                      ? 'text-[#b07f24] drop-shadow-[0_1px_2px_rgba(176,127,36,0.3)]'
                      : 'text-[#0f4d2c] hover:text-[#b07f24]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2.5px] bg-[#b07f24] rounded-full transition-all duration-300 ${
                      active ? 'w-full' : 'w-0'
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full text-[#0f4d2c] hover:text-[#b07f24] hover:bg-[#f6f2e7] transition-all duration-300"
              aria-label="Search"
            >
              <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden md:flex p-2.5 rounded-full text-[#0f4d2c] hover:text-[#b07f24] hover:bg-[#f6f2e7] transition-all duration-300"
              aria-label="Wishlist"
            >
              <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full text-[#0f4d2c] hover:text-[#b07f24] hover:bg-[#f6f2e7] transition-all duration-300"
              aria-label="Cart"
            >
              <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6h18" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="absolute top-1 right-1 w-[17px] h-[17px] bg-[#b07f24] text-white font-sans text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                0
              </span>
            </button>

            {/* Account / User Dropdown */}
            {user ? (
              <div className="relative hidden sm:block ml-1">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-sans text-[11px] font-bold uppercase tracking-[0.1em] border border-[#b07f24]/50 bg-white shadow-sm hover:border-[#b07f24] text-[#0f4d2c] transition-all duration-300"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Welcome,</span>
                  <span className="text-[#b07f24] font-extrabold tracking-wider [text-shadow:0_0_10px_rgba(176,127,36,0.5)]">
                    {user.displayName?.split(' ')[0] || user.email.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 mt-3 w-56 bg-[#fdfcf8] border border-[#b07f24]/30 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-5 py-3 border-b border-[#0f4d2c]/10">
                      <p className="font-serif text-sm font-bold text-[#0f4d2c]">{user.displayName || 'Customer'}</p>
                      <p className="font-sans text-[10px] text-[#14251b]/60 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      href={dashboardLink}
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest text-[#0f4d2c] hover:bg-[#f6f2e7] transition-colors mt-1 font-semibold"
                    >
                      {isAdmin || isEmployee ? 'Management Portal' : 'My Dashboard'}
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest text-[#0f4d2c] hover:bg-[#f6f2e7] transition-colors font-medium"
                    >
                      Checkout
                    </Link>
                    
                    <div className="border-t border-[#0f4d2c]/10 my-1"></div>
                    
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full text-left px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 ml-1 px-5 py-2 rounded-full font-sans text-[12px] font-bold uppercase tracking-[0.12em] border-2 border-[#b07f24] text-[#b07f24] hover:bg-[#0f4d2c] hover:text-[#fdfcf8] hover:border-[#0f4d2c] shadow-sm transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Account
              </Link>
            )}

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-full text-[#0f4d2c] hover:text-[#b07f24] transition-colors duration-300" 
              aria-label="Menu"
            >
              <div className="w-[20px] h-[15px] relative flex flex-col justify-between">
                <span className={`block h-[2px] rounded-full bg-current transition-all duration-400 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}/>
                <span className={`block h-[2px] rounded-full bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`}/>
                <span className={`block h-[2px] rounded-full bg-current transition-all duration-400 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}/>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════ SEARCH OVERLAY ═══════════ */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${searchOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-[#0f4d2c]/40 backdrop-blur-md transition-opacity duration-500 ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => { setSearchOpen(false); setSearchQuery('') }}
        />
        <div className={`relative max-w-2xl mx-auto mt-[18vh] px-6 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}>
          <div className="bg-[#fdfcf8] rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,.3)] overflow-hidden border border-[#b07f24]/30">
            <div className="flex items-center gap-4 px-7 py-5 border-b border-[#0f4d2c]/10">
              <svg className="w-5 h-5 text-[#b07f24] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5" strokeLinecap="round"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Ashwagandha, Shilajit, Cold-pressed oils..."
                className="flex-1 bg-transparent font-serif text-xl md:text-2xl text-[#14251b] placeholder:text-[#14251b]/40 placeholder:italic focus:outline-none"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="p-1.5 text-[#14251b]/60 hover:text-[#14251b] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="px-7 py-5 bg-[#f6f2e7]/40">
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#b07f24] font-bold mb-3">Trending Botanicals</p>
              <div className="flex flex-wrap gap-2">
                {['Ashwagandha','Shilajit','Triphala','Kumkumadi','Rosemary','Algae Oil'].map(t => (
                  <Link
                    key={t}
                    href={`/shop?search=${t.toLowerCase()}`}
                    onClick={() => setSearchOpen(false)}
                    className="px-4 py-1.5 bg-white border border-[#0f4d2c]/15 rounded-full font-sans text-[12px] font-semibold text-[#0f4d2c] hover:bg-[#0f4d2c] hover:text-white hover:border-[#0f4d2c] transition-all duration-300 shadow-sm"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center font-sans text-[10px] text-white/70 mt-4 tracking-wider">
            Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white text-[9px]">ESC</kbd> to close
          </p>
        </div>
      </div>

      {/* ═══════════ MOBILE MENU ═══════════ */}
      <div className={`fixed inset-0 z-[55] lg:hidden transition-all duration-500 ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-[#fdfcf8] transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col h-full pt-28 px-8 pb-12">
            <div className="flex-1">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-serif text-[32px] md:text-[38px] font-bold text-[#0f4d2c] py-3 border-b border-[#0f4d2c]/10 transition-all duration-500 ${
                    mobileOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                  }`}
                  style={{ transitionDelay: mobileOpen ? `${i * 70 + 100}ms` : '0ms' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-4 pt-6">
              {user ? (
                <>
                  <Link
                    href={dashboardLink}
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-4 bg-[#0f4d2c] text-white font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-full shadow-md"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="block w-full text-center py-4 border border-[#0f4d2c]/20 text-[#0f4d2c] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-4 bg-[#0f4d2c] text-white font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-full shadow-md"
                >
                  My Account
                </Link>
              )}
              <p className="text-center font-sans text-[10px] text-[#b07f24] tracking-[0.2em] uppercase font-bold">
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