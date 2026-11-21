"use client";
import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1813] text-[#fdfcf8] pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Essence */}
          <div className="space-y-8 lg:col-span-1">
            <div className="inline-block bg-[#fdfcf8] p-4 rounded-xl">
              <img src="/logo1.svg" alt="Nutriwell Organics" className="h-10 w-auto" />
            </div>
            <p className="text-white/50 leading-relaxed text-sm max-w-xs font-light">
              Nutriwell Organics preserves the cellular intelligence of nature through Vedic wisdom and clinical purity.
            </p>
            <div className="flex gap-5 text-white/40">
              {/* Instagram SVG */}
              <Link href="#" className="hover:text-[#b07f24] transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link href="#" className="hover:text-[#b07f24] transition-colors"><Globe className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-[#b07f24] transition-colors"><Mail className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Experience Column */}
          <div>
            <h4 className="text-[#b07f24] font-serif text-lg mb-8 tracking-wide">Experience</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">The Journal</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">Ingredients Index</Link></li>
              <li><Link href="/sacred-pillars" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="/lab-purity" className="hover:text-white transition-colors">Certifications</Link></li>
            </ul>
          </div>

          {/* Support & Help Column */}
          <div>
            <h4 className="text-[#b07f24] font-serif text-lg mb-8 tracking-wide">Support & Help</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faqs" className="hover:text-white transition-colors">Common Inquiries (FAQs)</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              {/* Staff Portal Link */}
              <li className="pt-4 border-t border-white/5">
                <Link href="/login" className="text-white/20 hover:text-[#b07f24] flex items-center gap-2 transition-colors group">
                  <ShieldCheck className="w-3 h-3" /> 
                  <span className="text-[11px] uppercase tracking-widest font-medium">Staff Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 h-fit">
            <h4 className="text-white font-serif text-lg mb-4">The Inner Circle</h4>
            <p className="text-white/40 text-xs mb-6 leading-relaxed">
              Join our collective for seasonal rituals, early access to rare formulations, and Vedic insights.
            </p>
            <div className="relative border-b border-white/20 pb-2">
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-transparent focus:outline-none text-sm pr-10 text-[#fdfcf8]"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#b07f24] hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-medium text-center md:text-left">
            © {currentYear} Nutriwell Organics Private Limited. All Rights Reserved.
          </div>
          <div className="flex gap-4 items-center">
             <span className="text-[9px] tracking-widest text-white/20 border border-white/10 px-2 py-1 rounded">100% ORGANIC</span>
             <span className="text-[9px] tracking-widest text-white/20 border border-white/10 px-2 py-1 rounded">CLINICALLY TESTED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}