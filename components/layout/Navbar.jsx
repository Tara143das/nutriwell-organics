'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cartContext';

export default function Navbar() {
  const { user } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Eliminate Hydration Mismatch & Listen to scroll
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Apothecary Shop', href: '/shop' },
    { name: 'Sacred Pillars', href: '/#pillars' },
    { name: 'Lab Purity', href: '/#transparency' },
    { name: 'Journal', href: '/journal' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      
      {/* 1. TOP SACRED VEDIC TICKER STRIP */}
      <div className="bg-[#05130c] border-b border-[#b07f24]/20 py-1.5 px-4 sm:px-8 text-[#b07f24]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] tracking-[0.25em] font-medium uppercase font-sans">
          
          {/* Left Philosophy */}
          <div className="flex items-center space-x-2.5">
            <span className="text-[#d8a84e] font-semibold">✦ HEAL</span>
            <span className="text-white/20">•</span>
            <span className="text-[#d8a84e] font-semibold">NOURISH</span>
            <span className="text-white/20">•</span>
            <span className="text-[#d8a84e] font-semibold">MOVE</span>
            <span className="text-white/20">•</span>
            <span className="text-[#d8a84e] font-semibold">BALANCE</span>
          </div>

          {/* Right Announcement */}
          <div className="hidden md:flex items-center space-x-3 text-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="normal-case tracking-normal italic text-[11px] text-[#f6f2e7]/85">
              Ancient Healing with Modern Clinical Rigor. Free shipping on orders over ₹999.
            </span>
          </div>

        </div>
      </div>

      {/* 2. MAIN ULTRA-LUXURY NAVIGATION BAR */}
      <nav 
        className={`w-full transition-all duration-500 ease-in-out px-4 sm:px-8 lg:px-12 ${
          isScrolled 
            ? 'bg-[#081e14]/95 backdrop-blur-xl py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.45)] border-b border-[#b07f24]/30' 
            : 'bg-[#092217]/90 backdrop-blur-md py-3.5 border-b border-[#b07f24]/20'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LEFT: REFINED PORCELAIN EMBLEM LOGO */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="group block focus:outline-none">
              <div className="bg-[#fdfcf8] px-3.5 py-1.5 md:py-2 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-[#b07f24]/40 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_6px_25px_rgba(176,127,36,0.35)] group-hover:border-[#b07f24]">
                <Image 
                  src="/logo1.svg" 
                  alt="Nutriwell Organics" 
                  width={140} 
                  height={38} 
                  className="w-auto h-7 md:h-8 object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Sub-tagline Divider (Hidden on mobile) */}
            <div className="hidden xl:flex items-center space-x-3 pl-2 border-l border-[#b07f24]/30">
              <span className="text-[9px] uppercase tracking-[0.22em] text-[#d8a84e] font-serif font-light">
                Ayurvedic Apothecary
              </span>
            </div>
          </div>

          {/* CENTER: DESKTOP NAVIGATION LINKS */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 py-1 ${
                    isActive 
                      ? 'text-[#d8a84e] font-semibold' 
                      : 'text-[#f6f2e7]/80 hover:text-[#d8a84e]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#d8a84e] shadow-[0_0_8px_#d8a84e] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: ACTION SUITE (Auth, Cart, Explore CTA) */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Customer Account / Sanctuary */}
            <Link
              href={mounted && user ? "/account" : "/login"}
              className="flex items-center space-x-2 text-[#f6f2e7]/85 hover:text-[#d8a84e] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full border border-[#b07f24]/30 flex items-center justify-center group-hover:border-[#d8a84e] transition-colors bg-[#05130c]/50">
                <svg className="w-4 h-4 text-[#d8a84e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider font-medium">
                {mounted && user ? 'Sanctuary' : 'Customer Login'}
              </span>
            </Link>

            {/* Sacred Apothecary Cart Basket */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="relative p-2 text-[#f6f2e7]/85 hover:text-[#d8a84e] transition-colors focus:outline-none group"
            >
              <svg className="w-6 h-6 text-[#d8a84e] group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              
              {/* Hydration-safe Cart Count Badge */}
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#b07f24] text-[#05130c] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#092217] shadow-lg animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Regal Brushed Gold CTA */}
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#b07f24] via-[#c69a3d] to-[#996a1a] text-[#081a12] text-[10px] font-bold uppercase tracking-[0.18em] shadow-[0_4px_15px_rgba(176,127,36,0.25)] hover:shadow-[0_6px_22px_rgba(176,127,36,0.45)] hover:brightness-110 active:scale-95 transition-all duration-300"
            >
              Explore Shop
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 text-[#d8a84e] hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>

          </div>

        </div>

        {/* 3. MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-4 pb-6 border-t border-[#b07f24]/20 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-xs uppercase tracking-widest font-medium py-2 px-3 rounded-md transition-colors ${
                  pathname === link.href 
                    ? 'bg-[#05130c] text-[#d8a84e]' 
                    : 'text-[#f6f2e7]/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-sm bg-gradient-to-r from-[#b07f24] to-[#8c641d] text-[#081a12] text-xs font-bold uppercase tracking-widest shadow-md"
              >
                Explore Shop
              </Link>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
}