"use client";
import React from 'react';
import { ShieldCheck, Zap, Microscope, Search } from 'lucide-react';

export default function LabPurityPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#b07f24] font-bold tracking-[0.3em] uppercase text-xs">Purity Redefined</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#0f4d2c] mt-4 mb-6">Clinical Integrity</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <ShieldCheck />, title: "ICP-MS Testing", desc: "Heavy metal screening for Mercury, Lead, and Arsenic down to parts per billion." },
            { icon: <Zap />, title: "HPLC Verified", desc: "High-Performance Liquid Chromatography ensures standardized active compounds." },
            { icon: <Microscope />, title: "0% Synthetics", desc: "No magnesium stearate, silicon dioxide, or artificial fillers ever." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 md:p-10 rounded-2xl border border-[#0f4d2c]/5 text-center">
              <div className="w-16 h-16 bg-[#f6f2e7] rounded-full flex items-center justify-center text-[#0f4d2c] mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-serif text-[#0f4d2c] mb-4">{item.title}</h3>
              <p className="text-[#14251b]/60 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CoA Transparency Box */}
        <div className="bg-[#0a1813] text-white rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl font-serif mb-4">Transparency Audit</h2>
            <p className="text-white/60 mb-8 leading-relaxed text-sm">
              Access the clinical batch analysis for every Nutriwell formulation. Enter your batch number below to view the full Certificate of Analysis (CoA).
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Enter Batch ID (e.g. NW-2024-001)" 
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-6 py-3.5 focus:outline-none focus:border-[#b07f24] text-sm" 
              />
              <button className="bg-[#b07f24] hover:bg-[#c9953a] px-8 py-3.5 rounded-lg font-bold text-sm transition-colors text-[#0a1813]">
                Verify
              </button>
            </div>
          </div>
          <Search className="absolute top-1/2 right-[-5%] -translate-y-1/2 w-96 h-96 text-white/[0.03] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}