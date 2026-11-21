"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Ingredients from '@/components/Ingredients';
import PromoPopup from '@/components/home/PromoPopup';

const SLIDES = [
  '/slides/SLIDE-1.mp4',
  '/slides/SLIDE-2.mp4',
  '/slides/SLIDE-3.mp4',
  '/slides/SLIDE-4.mp4',
  '/slides/SLIDE-5.mp4',
];

const MARQUEE_ITEMS = [
  "Healthy Living",
  "Sustainable Future",
  "Holistic Wellness",
  "Pure Ingredients",
  "Ayurvedic Wisdom"
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef(null);

  // 5-Video Auto Transition
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentSlide]);

  return (
    <div className="bg-[#fdfcf8] text-[#14251b] font-sans overflow-x-hidden">
      
      {/* Welcome Voucher Modal */}
      <PromoPopup />

      {/* 1. CLEAN HERO VIDEO SLIDER (20% Reduced Height = 80vh) */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          key={SLIDES[currentSlide]}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 scale-[1.01]"
        >
          <source src={SLIDES[currentSlide]} type="video/mp4" />
        </video>

        {/* Minimal Bottom Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentSlide === i ? 'w-10 bg-[#b07f24]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. INFINITE VEDIC MARQUEE STRIP */}
      <section className="bg-[#fdfcf8] py-8 md:py-10 border-y border-[#0f4d2c]/10 overflow-hidden relative">
        <style jsx>{`
          @keyframes marqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marqueeScroll 26s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="marquee-track flex items-center whitespace-nowrap">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center">
              {MARQUEE_ITEMS.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center">
                  <span className="text-3xl md:text-5xl font-serif text-[#0f4d2c] tracking-tight font-medium hover:text-[#b07f24] transition-colors duration-300">
                    {item}
                  </span>
                  <span className="text-[#b07f24] text-xl md:text-2xl mx-8 md:mx-14 select-none">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 3. ABOUT NUTRIWELL SECTION */}
      <section className="py-24 bg-[#f6f2e7] text-[#14251b] px-6 md:px-12 border-t border-stone-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#b07f24] font-semibold">
              ✦ OUR ORIGIN & INTEGRITY
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#0f4d2c] leading-tight">
              Ancient Healing. <br />
              <span className="italic font-light text-[#b07f24]">with Modern Wellness.</span>
            </h2>
            <p className="text-stone-700 text-xs md:text-sm leading-relaxed font-sans">
              Founded on the bedrock of genuine Ayurvedic pharmacology, Nutriwell Organics was born to dismantle the commercial wellness status quo of diluted pills and hidden heavy metals.
            </p>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-sans">
              We partner directly with indigenous foraging tribes in high-altitude Himalayan biomes, sourcing botanicals harvested strictly in alignment with seasonal rhythms (Ritu Charya).
            </p>
            <div className="pt-2 flex items-center space-x-6">
              <div>
                <span className="block text-2xl font-serif font-bold text-[#0f4d2c]">3,000m+</span>
                <span className="text-[10px] text-stone-500 font-mono uppercase">Alpine Sourcing</span>
              </div>
              <div className="h-8 w-px bg-stone-300"></div>
              <div>
                <span className="block text-2xl font-serif font-bold text-[#0f4d2c]">0.0%</span>
                <span className="text-[10px] text-stone-500 font-mono uppercase">Synthetic Fillers</span>
              </div>
              <div className="h-8 w-px bg-stone-300"></div>
              <div>
                <span className="block text-2xl font-serif font-bold text-[#0f4d2c]">100%</span>
                <span className="text-[10px] text-stone-500 font-mono uppercase">UV Amber Glass</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative h-[400px] md:h-[480px] rounded-2xl overflow-hidden shadow-xl border border-[#b07f24]/30">
            <Image
              src="/images/IMAGE1.png"
              alt="About Nutriwell Organics Sourcing"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

        </div>
      </section>

      {/* 4. BOTANICAL INGREDIENTS SECTION */}
      <Ingredients />

      {/* 5. APOTHECARY OATH TEASER */}
      <section className="py-20 bg-[#0a1813] text-[#fdfcf8] px-6 text-center border-t border-[#b07f24]/30">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#b07f24] font-bold">
            THE APOTHECARY OATH
          </span>
          <h3 className="text-2xl md:text-4xl font-serif text-[#f6f2e7]">
            Zero Adulteration. Pure Living Prana.
          </h3>
          <p className="text-stone-300 text-xs md:text-sm leading-relaxed">
            Every bottle is hand-sealed in protective UV amber glass to safeguard volatile terpenes and phytomolecules from photodegradation.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#b07f24] to-[#996a1a] text-[#081a12] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Explore Apothecary Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}