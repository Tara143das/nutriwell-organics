'use client';
import React, { useState, useEffect } from 'react';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('nwo_dismissed')) setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#081e14] border-2 border-[#b07f24]/50 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white text-xl">✕</button>
        <span className="text-[10px] font-mono tracking-[0.3em] text-[#b07f24] uppercase">Welcome Gift</span>
        <h3 className="text-2xl font-serif text-white mt-2">20% Off First Harvest</h3>
        <p className="text-stone-400 text-xs mt-3 mb-6">Use code at checkout for your first botanical ritual.</p>
        <div className="bg-black/40 border border-[#b07f24]/30 p-3 rounded-lg mb-6">
          <span className="text-xl font-mono font-bold tracking-[0.2em] text-[#d8a84e]">ROYAL20</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="w-full py-3 bg-[#b07f24] text-[#081e14] text-xs font-bold uppercase tracking-widest rounded-lg hover:brightness-110">Claim My Offer</button>
      </div>
    </div>
  );
}