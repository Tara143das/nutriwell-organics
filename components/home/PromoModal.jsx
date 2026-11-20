'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Copy, Check, Sparkles, Gift } from 'lucide-react';

export default function PromoModal({
  isOpenOverride,
  onCloseOverride,
  imageUrl = '/images/IMAGE1.png',
  headline = 'Complimentary 10ml Saffron Elixir',
  subheadline = 'Unlock an exclusive apothecary welcome gift with your first order above ₹1,999.',
  couponCode = 'ROYALROYAL20',
  discountPercentage = '20% OFF'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Smart 24-hour dismissal logic using localStorage
    const dismissedTime = localStorage.getItem('nwo_promo_dismissed');
    const now = new Date().getTime();

    if (!dismissedTime || now - parseInt(dismissedTime, 10) > 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3500); // Trigger pop-up after 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('nwo_promo_dismissed', new Date().getTime().toString());
    if (onCloseOverride) onCloseOverride();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const showModal = isOpenOverride !== undefined ? isOpenOverride : isOpen;

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#fdfcf8] border border-[#b07f24] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden text-[#14251b]">
        
        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#0a1813]/60 hover:bg-[#0a1813] text-[#fdfcf8] border border-[#b07f24]/40 flex items-center justify-center transition-all duration-300"
          aria-label="Close Pop-Up"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Visual Column */}
          <div className="md:col-span-5 relative min-h-[220px] md:min-h-full bg-[#0a1813]">
            <Image
              src={imageUrl}
              alt="Nutriwell Promotion"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1813] via-transparent to-transparent md:hidden" />
            
            {/* Corner Badge */}
            <div className="absolute top-4 left-4 bg-[#b07f24] text-[#0a1813] font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              {discountPercentage}
            </div>
          </div>

          {/* Right Content Column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#fdfcf8]">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f2e7] border border-[#b07f24]/30 mb-3">
                <Gift className="w-3.5 h-3.5 text-[#b07f24]" />
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#0f4d2c]">
                  Apothecary Welcome Invitation
                </span>
              </div>

              <h3 className="text-2xl font-serif text-[#0f4d2c] font-light leading-snug">
                {headline}
              </h3>

              <p className="mt-2 text-xs text-[#14251b]/80 leading-relaxed font-sans">
                {subheadline}
              </p>
            </div>

            {/* Coupon Copy Box */}
            <div className="mt-6 p-4 rounded-2xl bg-[#f6f2e7] border border-[#b07f24]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#14251b]/60 font-medium block">
                  Your Exclusive Code
                </span>
                <span className="text-base font-mono font-bold text-[#0f4d2c] tracking-widest">
                  {couponCode}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0f4d2c] hover:bg-[#0a3520] text-[#fdfcf8] rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 border border-[#b07f24]/30 shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#b07f24]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#b07f24]" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Dismiss Link */}
            <button
              onClick={handleClose}
              className="mt-4 text-[11px] text-center text-[#14251b]/60 hover:text-[#0f4d2c] underline tracking-wider font-sans transition-colors"
            >
              No thanks, I will pay full price
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}