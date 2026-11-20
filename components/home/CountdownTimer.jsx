'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Sparkles, ArrowRight, ShieldAlert, Leaf } from 'lucide-react';

export default function CountdownTimer({
  targetDate,
  title = "Kashmiri Mongra Saffron Fresh Reserve — Batch #72",
  subtitle = "Supercritical cold extraction reserve ending soon. Once exhausted, next harvest cycle begins in Autumn.",
  productSlug = "kumkumadi-saffron-serum",
  stockRemaining = 27
}) {
  // Dynamic 7-day offset fallback if no specific targetDate is passed
  const calculateTarget = () => {
    if (targetDate) return new Date(targetDate).getTime();
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 4);
    defaultDate.setHours(23, 59, 59, 999);
    return defaultDate.getTime();
  };

  const [destinationTime] = useState(calculateTarget);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = destinationTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        clearInterval(timer);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [destinationTime]);

  return (
    <section className="py-16 bg-[#0a1813] text-[#fdfcf8] relative overflow-hidden border-y border-[#b07f24]/30 shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#b07f24]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#0f4d2c]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0f4d2c]/40 border border-[#b07f24]/40 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b07f24]/20 border border-[#b07f24]/40 text-[#b07f24] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Limited Harvest Reserve</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#fdfcf8] font-light leading-snug">
                {title}
              </h3>

              <p className="text-sm md:text-base text-[#fdfcf8]/80 font-sans leading-relaxed">
                {subtitle}
              </p>

              {/* Scarcity Pill */}
              <div className="flex items-center gap-3 pt-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#b07f24]" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#b07f24]">
                  Only <span className="font-bold underline text-[#fdfcf8]">{stockRemaining} handcrafted bottles</span> available in this batch
                </span>
              </div>
            </div>

            {/* Right Countdown Counter & CTA Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 bg-[#0a1813]/60 p-6 sm:p-8 rounded-2xl border border-[#b07f24]/30">
              
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#b07f24] font-medium">
                <Clock className="w-4 h-4" />
                <span>Batch Release Closes In</span>
              </div>

              {/* Countdown Digits Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center w-full">
                
                {/* Days */}
                <div className="bg-[#0f4d2c]/80 border border-[#b07f24]/40 rounded-xl p-2.5 sm:p-3 shadow-inner">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf8] block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#b07f24] font-medium block mt-1">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="bg-[#0f4d2c]/80 border border-[#b07f24]/40 rounded-xl p-2.5 sm:p-3 shadow-inner">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf8] block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#b07f24] font-medium block mt-1">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div className="bg-[#0f4d2c]/80 border border-[#b07f24]/40 rounded-xl p-2.5 sm:p-3 shadow-inner">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf8] block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#b07f24] font-medium block mt-1">
                    Mins
                  </span>
                </div>

                {/* Seconds */}
                <div className="bg-[#0f4d2c]/80 border border-[#b07f24]/40 rounded-xl p-2.5 sm:p-3 shadow-inner">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf8] block animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#b07f24] font-medium block mt-1">
                    Secs
                  </span>
                </div>

              </div>

              {/* Direct Purchase Link */}
              <Link
                href={`#shop-by-concern`}
                className="w-full py-3.5 px-6 rounded-xl bg-[#b07f24] hover:bg-[#c9942b] text-[#0a1813] font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 shadow-[0_0_20px_rgba(176,127,36,0.3)] flex items-center justify-center gap-2 group"
              >
                <span>Reserve Batch Allocation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}