'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const PILLARS_DATA = [
  {
    id: 'botanicals',
    number: '01',
    title: 'Sacred Botanicals',
    subtitle: 'Wildcrafted Himalayan Flora & Cold-Solvent Alchemy',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    description: 'We harvest solely beyond 3,000 meters elevation in pristine Himalayan micro-valleys. Extreme diurnal temperature swings naturally force these plants to concentrate bio-active protective withanolides, curcuminoids, and adaptogenic resins.',
    keyAttributes: [
      'Zero greenhouse cultivation or forced growth hormones',
      'Wild-foraged following traditional Charaka lunar cycles',
      'Proprietary sub-critical water extraction (Zero hexane/acetone)',
      'Retains 98.4% volatile terpene and lipid profiles'
    ]
  },
  {
    id: 'therapeutic-food',
    number: '02',
    title: 'Therapeutic Food',
    subtitle: 'Ahara as Primary Medicine & Deep Agni Restoration',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=80',
    description: 'Ayurveda dictates that when diet is wrong, medicine is of no use; when diet is correct, medicine is of no need. We design unrefined, organic whole-food matrices that harmonize the six Ayurvedic tastes (Shad Rasa) to rekindle dormant metabolic fires.',
    keyAttributes: [
      'A2 Gir Cow Ghee enriched with medicinal roots',
      'Stone-ground ancient heritage grains & low-glycemic millets',
      'Bio-fermented prebiotic Agni formulations',
      '100% free of refined white cane sugars, syrups, and gums'
    ]
  },
  {
    id: 'yogic-balance',
    number: '03',
    title: 'Yogic Balance',
    subtitle: 'Somatic Breathwork & Parasympathetic Nervous Equilibrium',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80',
    description: 'Botanicals work on the physical tissue (Annamaya Kosha), but enduring homeostasis requires regulating the vital breath sheath (Pranamaya Kosha). Our curated pranayamas directly stimulate the vagus nerve, rapidly lowering salivary cortisol.',
    keyAttributes: [
      'Baroreceptor-stimulating Nadi Shodhana protocols',
      'Subtle neuro-endocrine activation via Bhramari vibration',
      'Grounding Vata-pacifying restorative postures',
      'Clinically reviewed safe sequences for minor & chronic profiles'
    ]
  },
  {
    id: 'cellular-defense',
    number: '04',
    title: 'Cellular Defense',
    subtitle: 'Rasayana Longevity & DNA Integrity Protection',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    description: 'Rasayana is the classical science of defying senescence. Our botanical compounds target the cellular roots of aging—quenching reactive oxygen species (ROS), preserving telomere caps, and promoting healthy mitochondrial mitophagy.',
    keyAttributes: [
      'High-ORAC full-spectrum cellular antioxidant matrices',
      'SIRT-1 and AMPK gene pathway up-regulation',
      'Tri-doshic cellular adaptogens for systemic resilience',
      'Documented DNA radioprotective phytochemical markers'
    ]
  }
];

export default function SacredPillarsSection() {
  const [activePillar, setActivePillar] = useState(0);
  const current = PILLARS_DATA[activePillar];

  return (
    <section id="pillars" className="py-24 bg-[#07150f] text-[#fdfcf8] relative overflow-hidden scroll-mt-20">
      
      {/* Decorative Gold Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#b07f24]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0f4d2c]/30 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0a2618] border border-[#b07f24]/40 text-[#b07f24] text-[10px] tracking-[0.25em] uppercase font-mono">
            <span>✦ THE QUADRANT OF LIFE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-[#f6f2e7] tracking-tight">
            Our Four Sacred Pillars
          </h2>
          <p className="text-stone-300 text-xs md:text-sm font-sans leading-relaxed">
            Every Nutriwell formulation is engineered at the sacred intersection of four ancient tenets, validated by contemporary metabolic science.
          </p>
        </div>

        {/* Pillar Selection Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {PILLARS_DATA.map((pillar, idx) => (
            <button
              key={pillar.id}
              onClick={() => setActivePillar(idx)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                activePillar === idx
                  ? 'bg-[#0f3422] border-[#b07f24] shadow-[0_4px_25px_rgba(176,127,36,0.25)]'
                  : 'bg-[#091b13]/60 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className={`text-[11px] font-mono block mb-1 ${activePillar === idx ? 'text-[#b07f24]' : 'text-stone-500'}`}>
                {pillar.number}
              </span>
              <h3 className={`text-sm md:text-base font-serif font-medium ${activePillar === idx ? 'text-white' : 'text-stone-300'}`}>
                {pillar.title}
              </h3>
            </button>
          ))}
        </div>

        {/* Active Pillar Showcase Stage */}
        <div className="bg-[#0b2117]/80 border border-[#b07f24]/30 rounded-2xl p-6 md:p-12 backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-500">
          
          {/* Left Visual Emblem */}
          <div className="lg:col-span-5 relative h-72 md:h-96 rounded-xl overflow-hidden border border-[#b07f24]/20 shadow-2xl">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07150f] via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 bg-[#07150f]/80 backdrop-blur-md p-3 rounded-lg border border-[#b07f24]/30 text-center">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#b07f24]">PILLAR {current.number} • PURITY RATIFIED</span>
            </div>
          </div>

          {/* Right Detailed Copy & Bio-Markers */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#b07f24]">
                TENET {current.number}
              </span>
              <h3 className="text-2xl md:text-4xl font-serif text-[#f6f2e7] mt-1">
                {current.title}
              </h3>
              <p className="text-sm text-emerald-400/90 font-mono mt-1">
                {current.subtitle}
              </p>
            </div>

            <p className="text-stone-300 text-xs md:text-sm leading-relaxed font-sans">
              {current.description}
            </p>

            {/* Micro Criteria List */}
            <div className="space-y-2.5 pt-2 border-t border-stone-800">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#b07f24]">Standard Operating Protocols:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.keyAttributes.map((attr, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-stone-300">
                    <span className="text-[#b07f24] font-bold">✓</span>
                    <span>{attr}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}