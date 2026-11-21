'use client';

import React, { useState } from 'react';

const TESTED_BATCHES = [
  {
    batchNo: 'NWO-2026-ASH-09',
    product: 'Himalayan Organic Ashwagandha KSM-66',
    date: '14 Nov 2026',
    heavyMetals: { lead: '< 0.005 ppm (Safe)', mercury: 'ND (Not Detected)', cadmium: '< 0.002 ppm' },
    activePotency: 'Withanolides: 5.42% (Ph. Eur Standard)',
    microbial: 'Zero Coliforms / Salmonella',
    status: '100% PURE & CERTIFIED'
  },
  {
    batchNo: 'NWO-2026-TRI-04',
    product: 'Triphala Supreme Botanical Digestive Elixir',
    date: '08 Nov 2026',
    heavyMetals: { lead: '< 0.004 ppm', mercury: 'ND', cadmium: 'ND' },
    activePotency: 'Tannins & Polyphenols: 44.8%',
    microbial: 'Pesticide Residue: 0.00%',
    status: '100% PURE & CERTIFIED'
  },
  {
    batchNo: 'NWO-2026-SHI-12',
    product: 'Purified Gold-Grade Himalayan Shilajit Resin',
    date: '02 Nov 2026',
    heavyMetals: { lead: '< 0.008 ppm (Permissible < 10 ppm)', mercury: 'ND', cadmium: '< 0.003 ppm' },
    activePotency: 'Fulvic Acid: 78.6% (HPLC Tested)',
    microbial: 'Heavy metals ICP-MS Certified',
    status: '100% PURE & CERTIFIED'
  }
];

export default function LabPuritySection() {
  const [selectedBatch, setSelectedBatch] = useState(TESTED_BATCHES[0]);

  return (
    <section id="transparency" className="py-24 bg-[#0a1813] text-[#fdfcf8] border-t border-[#b07f24]/20 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#05130c] border border-[#b07f24]/30 text-[#b07f24] text-[10px] tracking-[0.25em] uppercase font-mono">
            <span>✦ UNCOMPROMISING BOTANICAL RIGOR</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-[#f6f2e7] tracking-tight">
            Lab Purity & Traceability
          </h2>
          <p className="text-stone-300 text-xs md:text-sm font-sans leading-relaxed">
            We reject the industry status quo of proprietary secrets. Every harvest batch undergoes independent third-party ICP-MS heavy metal tests and HPLC chemical fingerprinting.
          </p>
        </div>

        {/* 3 Quality Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-[#07130e] border border-stone-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#0f4d2c]/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4">
              0.0%
            </div>
            <h4 className="text-base font-serif text-white">Zero Synthetic Fillers</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              No magnesium stearate, silicon dioxide, talc, artificial flavorings, or petrochemical preservatives. Pure active botanical matter only.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#07130e] border border-stone-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#0f4d2c]/30 border border-[#b07f24]/30 flex items-center justify-center text-[#b07f24] font-bold mb-4">
              ICP
            </div>
            <h4 className="text-base font-serif text-white">Inductively Coupled Plasma Mass Spectrometry</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Screened down to parts-per-billion (ppb) for Lead, Mercury, Arsenic, and Cadmium to guarantee neurotoxic safety.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#07130e] border border-stone-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#0f4d2c]/30 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mb-4">
              HPLC
            </div>
            <h4 className="text-base font-serif text-white">Chromatographic Fingerprinting</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Verifies authentic active phyto-molecules matching classical Pharmacopoeia reference standards with no adulterated cheap substitutes.
            </p>
          </div>
        </div>

        {/* Live Certificate of Analysis (CoA) Terminal */}
        <div className="bg-[#05130c] border border-[#b07f24]/40 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#b07f24] uppercase">Live Third-Party Audit Ledger</span>
              <h3 className="text-lg font-serif text-white mt-0.5">Recent Batch Verification Reports</h3>
            </div>

            <div className="flex gap-2">
              {TESTED_BATCHES.map((b) => (
                <button
                  key={b.batchNo}
                  onClick={() => setSelectedBatch(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    selectedBatch.batchNo === b.batchNo
                      ? 'bg-[#0f4d2c] text-white border border-[#b07f24]'
                      : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'
                  }`}
                >
                  {b.batchNo}
                </button>
              ))}
            </div>
          </div>

          {/* Active CoA Display Table */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#071710] border border-stone-800">
              <span className="text-[10px] text-stone-400 uppercase font-mono">Formulation</span>
              <p className="text-xs font-medium text-white mt-1">{selectedBatch.product}</p>
              <span className="text-[10px] text-stone-500 font-mono block mt-2">Tested: {selectedBatch.date}</span>
            </div>

            <div className="p-4 rounded-lg bg-[#071710] border border-stone-800">
              <span className="text-[10px] text-stone-400 uppercase font-mono">Heavy Metals Screen</span>
              <p className="text-xs text-emerald-400 mt-1">Lead: {selectedBatch.heavyMetals.lead}</p>
              <p className="text-xs text-emerald-400">Mercury: {selectedBatch.heavyMetals.mercury}</p>
            </div>

            <div className="p-4 rounded-lg bg-[#071710] border border-stone-800">
              <span className="text-[10px] text-stone-400 uppercase font-mono">Standardized Potency</span>
              <p className="text-xs font-semibold text-[#b07f24] mt-1">{selectedBatch.activePotency}</p>
              <span className="text-[10px] text-stone-400 font-mono block mt-2">{selectedBatch.microbial}</span>
            </div>

            <div className="p-4 rounded-lg bg-[#0f3422]/60 border border-emerald-500/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 uppercase font-mono">Audit Outcome</span>
                <p className="text-xs font-bold text-white mt-1 tracking-wider">{selectedBatch.status}</p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono mt-3">Verified by NABL Accredited Labs</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}