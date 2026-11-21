"use client";
import React from 'react';

const PILLARS = [
  {
    id: "01",
    title: "Sacred Botanicals",
    desc: "Ancient herbs sourced from their natural habitats during specific lunar cycles for maximum potency.",
    img: "/images/Sacred Botanicals.png"
  },
  {
    id: "02",
    title: "Therapeutic Food",
    desc: "Using food as medicine to restore metabolic fire and cellular intelligence.",
    img: "/images/Therapeutic Food.png"
  },
  {
    id: "03",
    title: "Yogic Balance",
    desc: "Synchronizing physical movement with breath to activate the body's subtle energy channels.",
    img: "/images/Yogic Balance.png"
  },
  {
    id: "04",
    title: "Cellular Defense",
    desc: "Advanced protocols to shield cells from modern environmental stressors and toxins.",
    img: "/images/Cellular Defense.png"
  }
];

export default function SacredPillarsPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#0f4d2c] mb-6">The Four Sacred Pillars</h1>
          <p className="text-[#14251b]/70 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Our philosophy is rooted in four essential foundations that harmonize ancient wisdom with clinical purity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {PILLARS.map((pillar) => (
            <div key={pillar.id} className="group relative overflow-hidden rounded-3xl bg-[#f6f2e7] p-8 border border-[#0f4d2c]/5">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden shadow-inner bg-white">
                  <img src={pillar.img} alt={pillar.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="w-full md:w-1/2">
                  <span className="text-[#b07f24] font-serif text-4xl mb-4 block opacity-50">{pillar.id}</span>
                  <h3 className="text-2xl font-serif text-[#0f4d2c] mb-4">{pillar.title}</h3>
                  <p className="text-[#14251b]/70 leading-relaxed italic">{pillar.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}