"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const ingredientsData = [
  {
    id: "card-1",
    tag: "HERBAL ACTIVES",
    title: "Herbal Actives",
    image: "/ingredients/card1.png",
    animType: "fountain",
    titleColor: "text-[#d4f8d3] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_20px_rgba(46,125,50,0.6)]",
    tagBadge: "bg-[#0f4d2c]/90 text-[#a3e635] border-[#84cc16]/50",
    pillStyle: "bg-[#0a3520]/85 text-[#f0fdf4] border-[#4ade80]/40 hover:border-[#86efac] hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]",
    items: ["Fennel", "Cumin", "Pudina", "Ajwain", "Camphor", "Ginger"],
  },
  {
    id: "card-2",
    tag: "COLD-PRESSED BASE OILS",
    title: "Nourishing Oils",
    image: "/ingredients/card2.png",
    animType: "shimmer",
    titleColor: "text-[#fef08a] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_20px_rgba(176,127,36,0.7)]",
    tagBadge: "bg-[#713f12]/90 text-[#fde047] border-[#ca8a04]/50",
    pillStyle: "bg-[#582c0e]/85 text-[#fffbeb] border-[#facc15]/45 hover:border-[#fef08a] hover:shadow-[0_0_15px_rgba(250,204,21,0.5)]",
    items: [
      "Moroccan Argan Oil",
      "Extra Virgin Coconut Oil",
      "Golden Jojoba",
      "Sweet Almond",
    ],
  },
  {
    id: "card-3",
    tag: "MARINE BOTANICAL OIL",
    title: "Marine Algae Oil",
    image: "/ingredients/card3.png",
    animType: "wave",
    titleColor: "text-[#a5f3fc] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.6)]",
    tagBadge: "bg-[#164e63]/90 text-[#67e8f9] border-[#22d3ee]/50",
    pillStyle: "bg-[#083344]/85 text-[#ecfeff] border-[#38bdf8]/40 hover:border-[#7dd3fc] hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]",
    items: ["Pure Algae Oil", "Pure Kelp", "Marine Minerals"],
  },
  {
    id: "card-4",
    tag: "AROMATIC BOTANICALS",
    title: "Essential Oils",
    image: "/ingredients/card4.png",
    animType: "typewriter",
    titleColor: "text-[#f5d0fe] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_20px_rgba(192,38,211,0.6)]",
    tagBadge: "bg-[#581c87]/90 text-[#e879f9] border-[#c084fc]/50",
    pillStyle: "bg-[#3b0764]/85 text-[#faf5ff] border-[#c084fc]/40 hover:border-[#e9d5ff] hover:shadow-[0_0_15px_rgba(192,132,252,0.5)]",
    items: ["Rosemary", "Tea Tree", "Lavender", "Cedarwood", "& Others"],
  },
  {
    id: "card-5",
    tag: "BOTANICAL WELLNESS",
    title: "Botanical Wellness",
    image: "/ingredients/card5.png",
    animType: "vitality",
    titleColor: "text-[#fed7aa] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_20px_rgba(234,88,12,0.6)]",
    tagBadge: "bg-[#7c2d12]/90 text-[#fdba74] border-[#fb923c]/50",
    pillStyle: "bg-[#431407]/85 text-[#fff7ed] border-[#fb923c]/45 hover:border-[#fdba74] hover:shadow-[0_0_15px_rgba(251,146,60,0.5)]",
    items: [
      "Sea Buckthorn Oil",
      "Flaxseed Oil",
      "Ginkgo Biloba Extract",
      "& Others",
    ],
  },
];

// Infinite loop dataset construction
const loopedData = [
  ...ingredientsData,
  ...ingredientsData,
  ...ingredientsData,
];

export default function Ingredients() {
  const [currentIndex, setCurrentIndex] = useState(5);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const totalOriginal = ingredientsData.length;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3800);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= totalOriginal * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - totalOriginal);
    } else if (currentIndex < totalOriginal) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + totalOriginal);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isTransitioning]);

  const activeIndicator =
    ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;

  return (
    <section className="relative bg-[#fdfcf8] py-20 md:py-28 overflow-hidden font-sans border-t border-[#0f4d2c]/10">
      <style jsx>{`
        @keyframes fountainBounce { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes liquidShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes oceanWave { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-6px) rotate(1deg); } }
        @keyframes typewriterPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(0.97); } }
        @keyframes vitalityBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .anim-fountain { animation: fountainBounce 2.8s ease-in-out infinite; }
        .anim-shimmer { background-size: 200% 100%; animation: liquidShimmer 4s linear infinite; }
        .anim-wave { animation: oceanWave 3.2s ease-in-out infinite; }
        .anim-typewriter { animation: typewriterPulse 2.6s ease-in-out infinite; }
        .anim-vitality { animation: vitalityBreathe 3s ease-in-out infinite; }
      `}</style>

      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#b07f24]/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#0f4d2c]/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-10 h-[1.5px] bg-[#b07f24]"></span>
              <span className="text-xs uppercase tracking-[0.28em] text-[#b07f24] font-semibold font-mono">
                NATURE&apos;S APOTHECARY
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] tracking-tight leading-[1.12]">
              <span className="text-[#0f4d2c] font-bold block mb-1">The ingredients behind</span>
              <span className="italic font-normal bg-gradient-to-r from-[#b07f24] via-[#e5b958] via-[#0f4d2c] to-[#b07f24] bg-[length:200%_auto] bg-clip-text text-transparent [text-shadow:0_0_25px_rgba(176,127,36,0.35)]">
                Nutriwell Organics
              </span>
            </h2>
          </div>

          <div className="lg:max-w-lg">
            <div className="relative pl-6 border-l-2 border-[#b07f24]/60 bg-gradient-to-r from-[#f6f2e7]/80 to-transparent py-4 pr-4 rounded-r-2xl shadow-sm backdrop-blur-sm">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#0f4d2c]/10 border border-[#0f4d2c]/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b07f24] animate-ping"></span>
                <span className="text-[10px] font-mono tracking-widest text-[#0f4d2c] font-semibold uppercase">
                  100% Botanical Fidelity • Zero Synthetics
                </span>
              </div>
              <p className="text-sm md:text-[15px] text-[#14251b]/85 leading-relaxed font-normal">
                <strong className="text-[#0f4d2c] font-semibold font-serif italic text-base">Time-honoured botanicals</strong>, wild-harvested herbs, and{" "}
                <span className="text-[#b07f24] font-semibold border-b border-[#b07f24]/40 pb-0.5">therapeutic cold-pressed elixirs</span> that have guided holistic healing rituals for generations.
              </p>
              <div className="flex items-center justify-between pt-5 mt-2 border-t border-[#0f4d2c]/10">
                <div className="flex items-center space-x-2">
                  {ingredientsData.map((_, dotIdx) => (
                    <span key={dotIdx} className={`h-1.5 rounded-full transition-all duration-500 ${activeIndicator === dotIdx ? "w-8 bg-[#b07f24] shadow-[0_0_10px_rgba(176,127,36,0.8)]" : "w-2 bg-[#0f4d2c]/25"}`}></span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button onClick={handlePrev} className="w-9 h-9 rounded-full border border-[#0f4d2c]/25 hover:border-[#b07f24] hover:bg-[#0f4d2c] hover:text-[#fdfcf8] text-[#0f4d2c] flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                  <button onClick={handleNext} className="w-9 h-9 rounded-full border border-[#0f4d2c]/25 hover:border-[#b07f24] hover:bg-[#0f4d2c] hover:text-[#fdfcf8] text-[#0f4d2c] flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div onTransitionEnd={handleTransitionEnd} className={`flex gap-6 ${isTransitioning ? "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" : "transition-none"}`} style={{ transform: `translateX(calc(-1 * ${currentIndex} * (100% + 24px) / 3))` }}>
            {loopedData.map((card, idx) => (
              <div key={`${card.id}-${idx}`} className="w-[calc(100%-16px)] sm:w-[calc(50%-16px)] lg:w-[calc((100%-48px)/3)] h-[510px] md:h-[550px] flex-shrink-0 relative rounded-[32px] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#0f4d2c]/15 hover:border-[#b07f24]/60">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  // Added priority to indices 5, 6, 7 (the initial visible set in the second loop) to satisfy LCP requirements
                  priority={idx >= 5 && idx <= 7}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/85 pointer-events-none"></div>
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                  <span className={`text-[10px] tracking-[0.22em] font-bold uppercase backdrop-blur-md px-3.5 py-1.5 rounded-full border shadow-md ${card.tagBadge}`}>{card.tag}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col justify-end">
                  <h3 className={`font-serif text-2xl md:text-3xl font-medium mb-4 ${card.titleColor}`}>{card.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.items.map((item, pIdx) => {
                      let animClass = "";
                      if (card.animType === "fountain") animClass = "anim-fountain";
                      else if (card.animType === "shimmer") animClass = "anim-shimmer";
                      else if (card.animType === "wave") animClass = "anim-wave";
                      else if (card.animType === "typewriter") animClass = "anim-typewriter";
                      else if (card.animType === "vitality") animClass = "anim-vitality";
                      return (
                        <span key={pIdx} style={{ animationDelay: `${pIdx * 0.22}s` }} className={`px-3.5 py-1.5 backdrop-blur-md text-xs font-semibold tracking-wide rounded-full shadow-md border transition-all duration-300 cursor-pointer ${card.pillStyle} ${animClass}`}>{item}</span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}