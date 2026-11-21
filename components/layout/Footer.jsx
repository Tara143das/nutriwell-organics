'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1813] text-[#fdfcf8] pt-20 pb-10 border-t border-[#b07f24]/30 relative overflow-hidden font-sans">
      
      {/* Decorative Branding Watermark */}
      <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none select-none">
        <h2 className="text-[12rem] font-serif leading-none rotate-12">Nutriwell</h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* TOP SECTION: BRAND & COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16">
          
          {/* Column 1: Brand Essence */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="inline-block bg-white p-2 rounded-sm shadow-lg border border-[#b07f24]/30 transition-transform hover:scale-105">
              <Image 
                src="/logo1.svg" 
                alt="Nutriwell Organics" 
                width={140} 
                height={40} 
                className="w-auto h-8"
              />
            </Link>
            <p className="text-stone-400 text-xs leading-relaxed max-w-xs">
              Bridging 5,000 years of Ayurvedic wisdom with modern clinical rigorous science for the modern lifestyle.
            </p>
            {/* Social Links with Gold Hover */}
            <div className="flex items-center space-x-4">
              {['instagram', 'facebook', 'youtube'].map((social) => (
                <a 
                  key={social} 
                  href={`#${social}`} 
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-[#b07f24] hover:border-[#b07f24] transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current mask-icon" style={{ WebkitMaskImage: `url(/icons/${social}.svg)`, maskImage: `url(/icons/${social}.svg)` }}></div>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Apothecary Shop */}
          <div className="space-y-5">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#b07f24] font-bold">Apothecary Shop</h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li><Link href="/shop" className="hover:text-[#b07f24] transition-colors">All Formulations</Link></li>
              <li><Link href="/shop?category=digestion" className="hover:text-[#b07f24] transition-colors">Gut Equilibrium</Link></li>
              <li><Link href="/shop?category=stress" className="hover:text-[#b07f24] transition-colors">Stress & Sleep</Link></li>
              <li><Link href="/shop?category=vitality" className="hover:text-[#b07f24] transition-colors">Daily Vitality</Link></li>
              <li><Link href="/account" className="hover:text-[#b07f24] transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Column 3: Sacred Pillars (Philosophy) */}
          <div className="space-y-5">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#b07f24] font-bold">Our Philosophy</h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li><Link href="/#pillars" className="hover:text-[#b07f24] transition-colors">Sacred Botanicals</Link></li>
              <li><Link href="/#pillars" className="hover:text-[#b07f24] transition-colors">Therapeutic Food</Link></li>
              <li><Link href="/#pillars" className="hover:text-[#b07f24] transition-colors">Yogic Balance</Link></li>
              <li><Link href="/#pillars" className="hover:text-[#b07f24] transition-colors">Cellular Defense</Link></li>
              <li><Link href="/#transparency" className="hover:text-[#b07f24] transition-colors">Lab Purity & Rigor</Link></li>
            </ul>
          </div>

          {/* Column 4: Experience */}
          <div className="space-y-5">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#b07f24] font-bold">Experience</h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li><Link href="/about" className="hover:text-[#b07f24] transition-colors">Our Story</Link></li>
              <li><Link href="/journal" className="hover:text-[#b07f24] transition-colors">The Journal</Link></li>
              <li><Link href="/#transparency" className="hover:text-[#b07f24] transition-colors">Ingredients Index</Link></li>
              <li><Link href="/#transparency" className="hover:text-[#b07f24] transition-colors">Sustainability</Link></li>
              <li><Link href="/#transparency" className="hover:text-[#b07f24] transition-colors">Certifications</Link></li>
            </ul>
          </div>

          {/* Column 5: Support */}
          <div className="space-y-5">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#b07f24] font-bold">Support</h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li><Link href="/contact" className="hover:text-[#b07f24] transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#b07f24] transition-colors">Common Inquiries</Link></li>
              <li><Link href="/shipping" className="hover:text-[#b07f24] transition-colors">Shipping & Returns</Link></li>
              <li className="pt-2">
                <span className="text-[10px] text-stone-500 block mb-1">Clinical Support:</span>
                <a href="mailto:wellness@nutriwellorganics.com" className="text-[#b07f24] hover:underline">wellness@nutriwell.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* MIDDLE SECTION: TRUST BADGES (Minimalist) */}
        <div className="border-t border-stone-800/50 py-10 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {['GMP CERTIFIED', '100% ORGANIC', 'CRUELTY FREE', 'FSSAI APPROVED', 'NABL TESTED'].map((badge) => (
            <span key={badge} className="text-[9px] tracking-[0.3em] font-mono text-stone-400 border border-stone-800 px-3 py-1 rounded-full">
              {badge}
            </span>
          ))}
        </div>

        {/* BOTTOM SECTION: LEGAL & COPYRIGHT */}
        <div className="border-t border-stone-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-stone-500 tracking-wider">
            © {currentYear} NUTRIWELL ORGANICS PRIVATE LIMITED. ALL RIGHTS RESERVED.
          </div>
          
          <div className="flex items-center space-x-6 text-[10px] text-stone-500 tracking-widest uppercase">
            <Link href="/privacy" className="hover:text-[#b07f24] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#b07f24] transition-colors">Terms of Service</Link>
            <Link href="/refund" className="hover:text-[#b07f24] transition-colors">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}