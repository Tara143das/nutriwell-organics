"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, isEmployee } = useAuth();
  const { cartItems } = useCart() || { cartItems: [] };
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  // Destination based on user role
  const getDestination = () => {
    if (!user) return '/login';
    if (isAdmin) return '/admin/dashboard';
    if (isEmployee) return '/employee';
    return '/account';
  };

  const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Sacred Pillars", href: "/sacred-pillars" },
    { label: "Lab Purity", href: "/lab-purity" },
    { label: "Journal", href: "/journal" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50">
      {/* Top Philosophical Ticker */}
      <div className="bg-[#0a1813] text-[#b07f24] py-1.5 px-6 text-center text-[10px] tracking-[0.25em] uppercase font-semibold border-b border-white/5">
        Heal • Nourish • Move • Balance | Clinical Ayurveda for Modern Longevity
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <nav className="bg-[#0a1813]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Porcelain Logo Badge */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-[#fdfcf8] px-3.5 py-1.5 rounded-lg shadow-sm">
              <img src="/logo1.svg" alt="Nutriwell Organics" className="h-7 w-auto" />
            </div>
            <span className="hidden lg:block text-[#b07f24] text-[10px] tracking-[0.2em] uppercase font-serif pl-2 border-l border-white/10">
              Ancient Healing with Modern Wellness
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors ${
                    isActive ? "text-[#b07f24]" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-6">
            
            {/* Unified Login Button */}
            <Link
              href={mounted ? getDestination() : '/login'}
              className="flex items-center gap-2 text-white/90 hover:text-[#b07f24] text-xs uppercase tracking-widest transition-colors font-medium"
            >
              <User className="w-4 h-4 text-[#b07f24]" />
              <span>{mounted && user ? "Account" : "Login"}</span>
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-white hover:text-[#b07f24] transition-colors p-1">
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b07f24] text-[#0a1813] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Explore Shop Gold Button */}
            <Link
              href="/shop"
              className="hidden sm:inline-block bg-[#b07f24] text-[#0a1813] hover:bg-[#c49233] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-105"
            >
              Explore Shop
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-1"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 px-4 border-t border-white/10 mt-3 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-widest text-white/80 hover:text-[#b07f24] py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <Link
                href={mounted ? getDestination() : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-widest text-[#b07f24] font-bold"
              >
                {mounted && user ? "My Account" : "Login"}
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-widest text-white bg-[#b07f24] px-4 py-1.5 rounded-full font-bold"
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}