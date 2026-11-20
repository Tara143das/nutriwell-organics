'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/lib/cartContext'

export default function Navbar() {
  const pathname = usePathname()
  const { user, userProfile, logout } = useAuth()
  const { cartCount, openCart } = useCart()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  // Scroll effect detector
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserDropdownOpen(false)
  }, [pathname])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Apothecary Shop', href: '/shop' },
    { name: 'Sacred Pillars', href: '/#pillars' },
    { name: 'Lab Purity', href: '/#lab' },
  ]

  const isStaff = ['admin', 'subadmin', 'sales', 'logistics'].includes(userProfile?.role)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-[#fbf9f4]/95 backdrop-blur-md border-b border-[#b07f24]/30 ${
        scrolled ? 'shadow-[0_10px_30px_-10px_rgba(15,77,44,0.12)] py-3' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo1.svg"
            alt="Nutriwell Organics"
            className="w-9 h-9 object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg md:text-xl font-bold tracking-tight text-[var(--ink)] leading-none">
              Nutriwell <span className="text-[var(--gold)] italic">Organics</span>
            </span>
            <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[var(--forest)] font-semibold mt-0.5">
              Ayurvedic Apothecary
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-xs uppercase tracking-[0.18em] font-semibold text-[var(--muted)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors duration-300 relative py-1 hover:text-[var(--forest)] ${
                pathname === link.href ? 'text-[var(--forest)] font-bold' : ''
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--gold)] rounded-full animate-fade-in" />
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS: AUTH + CART + MOBILE TOGGLE */}
        <div className="flex items-center gap-4">
          
          {/* USER AUTH DROP DOWN / LOGIN BUTTON */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-[var(--cream)] border border-[#b07f24]/30 text-xs font-sans hover:border-[var(--gold)] transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-[var(--forest)] text-white text-[10px] font-bold flex items-center justify-center uppercase">
                  {userProfile?.fullName?.[0] || user.email?.[0] || 'U'}
                </span>
                <span className="font-semibold text-[var(--ink)] max-w-[100px] truncate hidden sm:inline">
                  {userProfile?.fullName?.split(' ')[0] || 'Account'}
                </span>
                <svg className="w-3 h-3 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[var(--line)] rounded-2xl shadow-xl overflow-hidden z-50 py-1 font-sans text-xs">
                  <div className="px-4 py-3 border-b border-[var(--line)] bg-[var(--cream)]/50">
                    <p className="font-semibold text-[var(--ink)] truncate">{userProfile?.fullName || 'Wellness Seeker'}</p>
                    <p className="text-[10px] text-[var(--muted)] truncate">{user.email}</p>
                    {isStaff && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[var(--gold)] text-white font-mono text-[9px] uppercase rounded-full">
                        Staff ({userProfile.role})
                      </span>
                    )}
                  </div>

                  <Link
                    href="/account"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2.5 hover:bg-[var(--cream)] text-[var(--ink)] font-medium"
                  >
                    📦 Orders & Account
                  </Link>

                  {isStaff && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2.5 hover:bg-[var(--cream)] text-[var(--forest)] font-semibold"
                    >
                      🛡️ Master Control Center
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout()
                      setUserDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-medium border-t border-[var(--line)]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2.5 rounded-full border border-[var(--forest)] text-[var(--forest)] font-sans text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[var(--forest)] hover:text-white transition-all duration-300"
            >
              Sign In
            </Link>
          )}

          {/* CART DRAWER BUTTON */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-full bg-[var(--cream)] border border-[#b07f24]/30 hover:border-[var(--gold)] text-[var(--ink)] transition-all duration-300 group"
            title="Open Sacred Cart"
          >
            <svg className="w-5 h-5 text-[var(--forest)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--gold)] text-white font-sans text-[10px] font-bold flex items-center justify-center shadow-md animate-scale-up">
                {cartCount}
              </span>
            )}
          </button>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--ink)] hover:text-[var(--forest)]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fbf9f4] border-b border-[var(--line)] px-6 py-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col gap-4 font-sans text-xs uppercase tracking-[0.18em] font-semibold text-[var(--ink)]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--forest)] transition-colors py-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}