"use client";
import React from 'react';
import Image from 'next/image';

const INGREDIENTS = [
  { name: "KSM-66 Ashwagandha", origin: "High-Altitude Rajasthan", benefit: "Cortisol Regulation", img: "/ingredients/card1.png" },
  { name: "Kashmiri Mongra Saffron", origin: "Pampore, Kashmir", benefit: "Neural Vitality", img: "/ingredients/card2.png" },
  { name: "Wildcrafted Shilajit", origin: "Himalayan Rocks (3000m)", benefit: "Cellular ATP", img: "/ingredients/card3.png" },
  { name: "Ceylon Cinnamon", origin: "Coastal Sri Lanka", benefit: "Metabolic Fire", img: "/ingredients/card4.png" },
  { name: "Siberian Ginseng", origin: "Northern Taiga", benefit: "Immune Defense", img: "/ingredients/card5.png" }
];

export default function Ingredients() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#b07f24] text-[10px] tracking-[0.3em] uppercase font-bold">Nature's Intelligence</span>
          <h2 className="text-4xl font-serif text-[#0f4d2c] mt-4">Sacred Formulations</h2>
        </div>

        <div className="flex flex-nowrap md:grid md:grid-cols-5 gap-6 overflow-x-auto pb-8 no-scrollbar">
          {INGREDIENTS.map((item, idx) => (
            <div key={idx} className="min-w-[280px] md:min-w-0 group cursor-default">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-[#f6f2e7] border border-[#0f4d2c]/5 shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1813]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-[#0f4d2c] font-serif text-lg mb-1">{item.name}</h3>
              <p className="text-[#b07f24] text-[10px] uppercase tracking-widest font-bold mb-2">{item.benefit}</p>
              <p className="text-[#14251b]/40 text-[11px] italic">{item.origin}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}