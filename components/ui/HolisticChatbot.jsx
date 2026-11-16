// components/ui/HolisticChatbot.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HolisticChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [stage, setStage] = useState('legal');
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setIsMinimized(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const wellnessData = {
    digestion: {
      title: 'Gut Microbiome & Metabolic Reset',
      medicine: 'SOLVE Amrit Kanth Ayurvedic Elixir',
      medSlug: 'solve-amrit-kanth-digestive',
      desc: 'Formulated to neutralize acid reflux and repair the stomach lining natively.',
      yoga: [
        'Vajrasana — Post-meal digestion',
        'Ardha Matsyendrasana — Spinal twist',
        'Pavanamuktasana — Toxin release',
      ],
      diet:
        'Intermittent fasting (14 hrs). Warm ginger-fennel water morning & night. Eliminate raw vegetables after sunset; switch to warm cooked stews (Khichdi).',
    },
    skin: {
      title: 'Cellular Skin Detoxification',
      medicine: 'REjuvenate Argan Botanical Cleanser',
      medSlug: 'rejuvenate-moroccan-argan-oil-face-wash',
      desc: 'Clinical-grade botanical extraction to clear pores without stripping natural oils.',
      yoga: [
        'Sarvangasana — Blood flow to face',
        'Halasana — Thyroid stimulation',
        'Surya Namaskar — Complete detox cycle',
      ],
      diet:
        'High hydration protocol (3L daily). Antioxidant-rich berries + cold-pressed Omega-3. Strictly avoid refined sugars, dairy, and high-glycemic processed foods.',
    },
    stress: {
      title: 'Nervous System & Cortisol Balance',
      medicine: 'Megawell Cold-Pressed Omega-3 Complex',
      medSlug: 'megawell-omega-3-complex',
      desc: 'High-potency plant-based brain food to repair neural pathways and induce deep sleep.',
      yoga: [
        'Viparita Karani — Legs up the wall',
        'Balasana — Child pose for grounding',
        'Yoga Nidra — Deep neural relaxation',
      ],
      diet:
        'Ashwagandha root powder with warm almond milk before sleep. Magnesium-rich pumpkin seeds. Absolute zero caffeine after 1:00 PM.',
    },
  };

  const handleLegalAccept = () => setStage('assessment');

  const handleSelection = (key) => {
    setSelectedIssue(key);
    setStage('analyzing');
    setTimeout(() => setStage('result'), 2500);
  };

  const resetTerminal = () => {
    setStage('assessment');
    setSelectedIssue(null);
  };

  if (!isOpen) return null;

  const result = selectedIssue ? wellnessData[selectedIssue] : null;

  return (
    <>
      <style jsx global>{`
        @keyframes nw-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes nw-pulse-ring {
          0% { transform: scale(0.85); opacity: 0.9; }
          70% { transform: scale(1.45); opacity: 0; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        @keyframes nw-glow-breathe {
          0%, 100% { filter: drop-shadow(0 0 8px #2A7A6E) drop-shadow(0 0 16px #D4A574); }
          50% { filter: drop-shadow(0 0 18px #3E9B8D) drop-shadow(0 0 28px #C76B4F) drop-shadow(0 0 12px #D4A574); }
        }
        @keyframes nw-hue-spin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes nw-slide-up {
          0% { transform: translateY(0); }
          30% { transform: translateY(0); }
          40% { transform: translateY(-28px); }
          70% { transform: translateY(-28px); }
          80% { transform: translateY(-56px); }
          100% { transform: translateY(-56px); }
        }
        @keyframes nw-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nw-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .nw-orb-ring {
          background: conic-gradient(from 0deg, #2A7A6E, #D4A574, #C76B4F, #3E9B8D, #2A7A6E);
          animation: nw-spin 2.8s linear infinite;
        }
        .nw-orb-pulse-1 {
          background: conic-gradient(from 90deg, #2A7A6E, #D4A574, #C76B4F, #2A7A6E);
          animation: nw-pulse-ring 2.2s ease-out infinite;
        }
        .nw-orb-pulse-2 {
          background: conic-gradient(from 180deg, #C76B4F, #3E9B8D, #D4A574, #C76B4F);
          animation: nw-pulse-ring 2.2s ease-out infinite 0.7s;
        }
        .nw-orb-core-glow {
          animation: nw-glow-breathe 2.4s ease-in-out infinite;
        }
        .nw-result-card {
          animation: nw-fade-up 0.5s ease-out both;
        }
        .nw-shimmer-bar {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%;
          animation: nw-shimmer 2.5s linear infinite;
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end w-full max-w-[400px] sm:max-w-[430px] px-4 sm:px-0 pointer-events-none">
        <div className="pointer-events-auto w-full flex flex-col items-end">

          {/* ========== MAIN TERMINAL ========== */}
          {!isMinimized && (
            <div className="w-full mb-5 rounded-[28px] overflow-hidden border border-white/15 shadow-[0_0_60px_rgba(42,122,110,0.35),0_20px_50px_rgba(0,0,0,0.5)] relative"
              style={{ height: '580px', maxHeight: '80vh' }}
            >
              {/* Animated multi-color border glow frame */}
              <div className="absolute -inset-[1px] rounded-[28px] opacity-80 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #2A7A6E, #D4A574, #C76B4F, #3E9B8D, #2A7A6E)',
                  backgroundSize: '300% 300%',
                  animation: 'nw-hue-spin 6s ease infinite',
                }}
              />
              <div className="absolute inset-[1.5px] rounded-[26.5px] bg-[#0A1210] overflow-hidden flex flex-col">
                
                {/* Ambient orbs inside */}
                <div className="absolute top-[-30%] left-[-20%] w-[70%] h-[70%] rounded-full bg-teal/25 blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-amber/15 blur-[70px] pointer-events-none" />
                <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-terracotta/10 blur-[60px] pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 px-5 py-4 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full nw-orb-ring opacity-90" />
                      <div className="absolute inset-[3px] rounded-full bg-[#0A1210]" />
                      <div className="relative w-2 h-2 rounded-full bg-cream-light shadow-[0_0_12px_#fff]" />
                    </div>
                    <div>
                      <h3 className="text-[12px] font-bold text-white tracking-[0.18em] uppercase">Vaidya AI Core</h3>
                      <p className="text-[9px] text-teal-light uppercase tracking-[0.2em] flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                        Neural Link Active
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Minimize"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="relative z-10 flex-1 overflow-y-auto p-5 scrollbar-hide">

                  {/* LEGAL */}
                  {stage === 'legal' && (
                    <div className="h-full flex flex-col justify-center nw-result-card">
                      <div className="rounded-2xl border border-amber/40 bg-gradient-to-br from-amber/10 via-black/40 to-black/40 p-5 shadow-[0_0_30px_rgba(212,165,116,0.12)]">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-amber/20 border border-amber/40 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <span className="text-amber text-[11px] font-bold uppercase tracking-[0.2em]">Medical Disclaimer</span>
                        </div>
                        <p className="text-[13px] text-cream-light/85 leading-relaxed font-light mb-3">
                          The <span className="text-white font-semibold">Ayurvedic medicines, organic supplements, botanical formulations</span>, dietary charts, and yogic asanas suggested by this AI are intended strictly for holistic lifestyle balancing.
                        </p>
                        <p className="text-[11px] text-cream-light/45 leading-relaxed">
                          These recommendations do not substitute professional clinical diagnosis, prescription, or treatment by a certified medical practitioner.
                        </p>
                      </div>
                      <button
                        onClick={handleLegalAccept}
                        className="mt-6 w-full py-3.5 rounded-xl text-white text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, #1E5C52, #2A7A6E, #3E9B8D)',
                          boxShadow: '0 0 24px rgba(42,122,110,0.55), inset 0 1px 0 rgba(255,255,255,0.15)',
                        }}
                      >
                        I Acknowledge & Proceed
                      </button>
                    </div>
                  )}

                  {/* ASSESSMENT */}
                  {stage === 'assessment' && (
                    <div className="nw-result-card">
                      <p className="text-[13px] text-cream-light/80 font-light leading-relaxed mb-6">
                        Initiating holistic scan. Select the primary physiological or neural imbalance you are currently experiencing:
                      </p>
                      <div className="flex flex-col gap-3.5">
                        {[
                          { key: 'digestion', label: 'Metabolic & Gut Fire Imbalance', sub: 'Acidity · Bloating · Indigestion', accent: '#2A7A6E' },
                          { key: 'skin', label: 'Cellular Skin Toxicity', sub: 'Acne · Dullness · Pigmentation', accent: '#D4A574' },
                          { key: 'stress', label: 'Neural Fatigue & Insomnia', sub: 'High Cortisol · Anxiety · Sleep Loss', accent: '#C76B4F' },
                        ].map((node) => (
                          <button
                            key={node.key}
                            onClick={() => handleSelection(node.key)}
                            className="group relative w-full p-4 rounded-2xl text-left overflow-hidden transition-all duration-300 border border-white/10 hover:border-white/25"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                          >
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ background: `linear-gradient(90deg, ${node.accent}22, transparent 70%)` }}
                            />
                            <div
                              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                              style={{ background: node.accent, boxShadow: `0 0 12px ${node.accent}` }}
                            />
                            <h4 className="relative z-10 text-[13px] font-bold text-cream-light tracking-wide mb-1 pl-2">{node.label}</h4>
                            <p className="relative z-10 text-[10px] uppercase tracking-[0.15em] pl-2" style={{ color: node.accent }}>{node.sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ANALYZING */}
                  {stage === 'analyzing' && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#2A7A6E] border-r-[#D4A574] border-b-[#C76B4F] animate-[nw-spin_1s_linear_infinite]" />
                        <div className="absolute inset-3 rounded-full border-[2px] border-transparent border-b-[#2A7A6E] border-l-[#D4A574] border-t-[#C76B4F] animate-[nw-spin_1.4s_linear_infinite_reverse]" />
                        <div className="absolute inset-6 rounded-full border border-white/20" />
                        <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_20px_#fff,0_0_40px_#2A7A6E] animate-pulse" />
                      </div>
                      <div className="h-7 overflow-hidden">
                        <div className="flex flex-col gap-7 animate-[nw-slide-up_3s_ease-in-out_forwards]">
                          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-teal-light via-amber to-teal-light">
                            Scanning dosha profile...
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber via-terracotta to-amber">
                            Mapping formulation synergy...
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-teal-light via-white to-teal-light">
                            Generating protocol...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========== RESULT — EYE CATCHING ========== */}
                  {stage === 'result' && result && (
                    <div className="pb-2 space-y-5">
                      {/* Title block with shimmer */}
                      <div className="nw-result-card relative overflow-hidden rounded-2xl border border-white/15 p-4"
                        style={{ background: 'linear-gradient(135deg, rgba(42,122,110,0.25), rgba(212,165,116,0.1), rgba(199,107,79,0.12))' }}
                      >
                        <div className="absolute inset-0 nw-shimmer-bar pointer-events-none" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-teal-light mb-1.5 relative z-10">
                          Diagnostic Protocol Generated
                        </p>
                        <h2 className="font-serif text-[22px] font-bold text-white leading-tight relative z-10">
                          {result.title}
                        </h2>
                      </div>

                      {/* PHASE 1 — Medicine (Teal Neon Card) */}
                      <div className="nw-result-card" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-dark"
                            style={{ background: 'linear-gradient(135deg,#3E9B8D,#2A7A6E)', boxShadow: '0 0 14px rgba(42,122,110,0.7)' }}
                          >01</span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-teal-light">
                            Medicine / Supplement
                          </span>
                        </div>
                        <Link href={`/product/${result.medSlug}`}>
                          <div
                            className="group relative rounded-2xl p-4 border transition-all duration-300 overflow-hidden cursor-pointer"
                            style={{
                              borderColor: 'rgba(62,155,141,0.55)',
                              background: 'linear-gradient(145deg, rgba(42,122,110,0.35), rgba(10,18,16,0.9))',
                              boxShadow: '0 0 28px rgba(42,122,110,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
                            }}
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-teal/30 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
                            <h4 className="relative z-10 font-bold text-[15px] text-white mb-1.5 group-hover:text-teal-light transition-colors">
                              {result.medicine}
                            </h4>
                            <p className="relative z-10 text-[12px] text-cream-light/70 font-light leading-relaxed mb-3">
                              {result.desc}
                            </p>
                            <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-dark"
                              style={{ background: 'linear-gradient(90deg,#3E9B8D,#D4A574)', boxShadow: '0 0 16px rgba(62,155,141,0.45)' }}
                            >
                              View Formulation
                              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* PHASE 2 — Yoga (Amber Neon Card) */}
                      <div className="nw-result-card" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-dark"
                            style={{ background: 'linear-gradient(135deg,#D4A574,#B8864F)', boxShadow: '0 0 14px rgba(212,165,116,0.7)' }}
                          >02</span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-amber">
                            Yogic Neural Reset
                          </span>
                        </div>
                        <div
                          className="rounded-2xl p-4 border space-y-2.5"
                          style={{
                            borderColor: 'rgba(212,165,116,0.5)',
                            background: 'linear-gradient(145deg, rgba(212,165,116,0.18), rgba(10,18,16,0.9))',
                            boxShadow: '0 0 24px rgba(212,165,116,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
                          }}
                        >
                          {result.yoga.map((asana, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: '#D4A574', boxShadow: '0 0 10px #D4A574' }}
                              />
                              <span className="text-[12px] text-cream-light/90 font-light">{asana}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PHASE 3 — Diet (Terracotta Neon Card) */}
                      <div className="nw-result-card" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white"
                            style={{ background: 'linear-gradient(135deg,#C76B4F,#a8553f)', boxShadow: '0 0 14px rgba(199,107,79,0.7)' }}
                          >03</span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-terracotta">
                            Therapeutic Diet Matrix
                          </span>
                        </div>
                        <div
                          className="rounded-2xl p-4 border"
                          style={{
                            borderColor: 'rgba(199,107,79,0.5)',
                            background: 'linear-gradient(145deg, rgba(199,107,79,0.2), rgba(10,18,16,0.9))',
                            boxShadow: '0 0 24px rgba(199,107,79,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
                          }}
                        >
                          <p className="text-[12px] text-cream-light/90 font-light leading-relaxed">
                            {result.diet}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={resetTerminal}
                        className="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 border border-white/15 hover:border-white/30 hover:text-white hover:bg-white/5 transition-all"
                      >
                        Run New Diagnostics
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== MINIMIZED MULTI-NEON PULSE ORB ========== */}
          {isMinimized && (
            <button
              onClick={() => setIsMinimized(false)}
              className="relative w-[72px] h-[72px] flex items-center justify-center group"
              aria-label="Open Vaidya AI"
            >
              {/* Pulse ring 1 */}
              <span className="absolute inset-0 rounded-full nw-orb-pulse-1 opacity-70" />
              {/* Pulse ring 2 */}
              <span className="absolute inset-0 rounded-full nw-orb-pulse-2 opacity-50" />
              {/* Spinning multicolor ring */}
              <span className="absolute inset-0 rounded-full nw-orb-ring blur-[1px]" />
              <span className="absolute inset-[3px] rounded-full bg-[#0A1210]" />
              {/* Soft outer glow */}
              <span
                className="absolute inset-[-6px] rounded-full opacity-80 nw-orb-core-glow pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, #2A7A6E88, #D4A57488, #C76B4F88, #3E9B8D88, #2A7A6E88)',
                  filter: 'blur(10px)',
                }}
              />
              {/* Core icon */}
              <span className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #1E5C52, #0A1210)',
                  boxShadow: 'inset 0 0 12px rgba(62,155,141,0.4)',
                }}
              >
                <svg className="w-5 h-5 text-cream-light drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </span>
              {/* Live badge */}
              <span className="absolute -top-0.5 -right-0.5 z-20 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-br from-amber to-terracotta border-2 border-[#0A1210]" />
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}