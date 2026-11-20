'use client';

import React from 'react';
import { Shield, Sparkles, Droplet, Sun, Microchip, Check } from 'lucide-react';

const PURITY_PILLARS = [
  {
    icon: Microchip,
    title: 'ICP-MS Heavy Metal Free',
    desc: 'Tested to 0.001 PPM precision. 100% free from Lead, Mercury, Arsenic, and Cadmium contaminants.'
  },
  {
    icon: Droplet,
    title: 'Supercritical CO₂ Extraction',
    desc: 'Zero-heat solvent-free cold extraction preserving 99.4% active bio-flavonoids and phytonutrients.'
  },
  {
    icon: Sun,
    title: '100% Amber UV Glass Packaging',
    desc: 'Zero micro-plastics migration. High-density apothecary amber glass shields against UV bio-degradation.'
  },
  {
    icon: Shield,
    title: 'Ayush Premium & ISO Certified',
    desc: 'Handcrafted in GMP-certified apothecary facilities under strict Ayurvedic Pharmacopoeia of India standards.'
  }
];

export default function LabTransparency() {
  return (
    <section className="py-20 bg-[#0a1813] text-[#fdfcf8] relative overflow-hidden border-y border-[#b07f24]/30">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0f4d2c]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f4d2c]/60 border border-[#b07f24]/40 mb-4 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#b07f24]" />
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#fdfcf8]">
              Uncompromising Clinical Purity
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#fdfcf8] font-light tracking-tight leading-tight">
            The Science of <span className="italic font-normal text-[#b07f24]">Cellular Cleanliness</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#fdfcf8]/80 font-sans leading-relaxed">
            While commercial brands compromise with cheap synthetic binders and heavy metals, Nutriwell Organics subjects every single batch to strict 3rd-party ICP-MS mass spectrometry.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PURITY_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#0f4d2c]/30 backdrop-blur-md border border-[#b07f24]/30 rounded-xl p-8 hover:border-[#b07f24] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-lg bg-[#b07f24]/10 border border-[#b07f24]/40 flex items-center justify-center mb-6 text-[#b07f24] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-serif font-light text-[#fdfcf8] mb-2 group-hover:text-[#b07f24] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-[#fdfcf8]/70 leading-relaxed font-sans">
                  {pillar.desc}
                </p>

                <div className="mt-6 flex items-center gap-1.5 text-[11px] text-[#b07f24] font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>100% Batch Certified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Certificate Verification Ribbon */}
        <div className="mt-14 p-6 rounded-2xl bg-[#0f4d2c]/50 border border-[#b07f24]/40 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#b07f24] text-[#0a1813] flex items-center justify-center font-bold text-lg shrink-0">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-serif text-[#fdfcf8] font-medium">
                Transparent Batch Certificate of Analysis (CoA)
              </h4>
              <p className="text-xs text-[#fdfcf8]/70">
                Every bottle shipped includes a unique QR code linked directly to its HPLC and heavy metal lab report.
              </p>
            </div>
          </div>

          <a
            href="/faqs"
            className="px-6 py-2.5 rounded-full bg-[#b07f24] hover:bg-[#c9942b] text-[#0a1813] font-semibold text-xs tracking-wider uppercase transition-all duration-300 shrink-0 shadow-[0_0_20px_rgba(176,127,36,0.3)]"
          >
            Verify Batch Report
          </a>
        </div>

      </div>
    </section>
  );
}