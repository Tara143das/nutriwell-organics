'use client';

import { useState, useEffect } from 'react';

const pillarsData = [
  {
    id: 'botanicals',
    title: 'Sacred Botanicals',
    subtitle: 'Nature’s Ancient Wisdom. Refined for Modern Wellbeing.',
    description: 'Rooted in the timeless traditions of Ayurveda, our botanical philosophy celebrates carefully selected herbs and plant extracts. We source the purest organic ingredients, honoring ancient harvesting rituals to preserve their maximum potency. These sacred botanicals work synergistically to nurture vitality, restore balance, and support the body’s natural resilience against daily stressors.',
    benefits: ['Wildcrafted & Organic', 'High Potency Extracts', 'Ancient Ayurvedic Alchemy'],
    image: '/images/Sacred Botanicals.png'
  },
  {
    id: 'food',
    title: 'Therapeutic Food',
    subtitle: 'Nourishment That Begins Within.',
    description: 'We believe that true radiance and health start in the gut. Discover the art of mindful nutrition through wholesome, nutrient-rich ingredients chosen specifically to support digestive wellness and metabolic function. Our therapeutic foods are formulated to provide cellular-level nourishment, bridging the gap between everyday diet and clinical holistic health.',
    benefits: ['Microbiome Support', 'Nutrient-Dense Profiles', 'Digestive Harmony'],
    image: '/images/Therapeutic Food.png'
  },
  {
    id: 'yoga',
    title: 'Yogic Balance',
    subtitle: 'Move with Intention. Restore Your Inner Calm.',
    description: 'Physical wellness is incomplete without mental tranquility. We embrace the harmony of mindful movement and conscious breathing. Our formulations and lifestyle guidelines are designed to complement your yogic practices—encouraging deep relaxation, easing everyday tension, and cultivating a more restorative approach to rest, sleep, and overall wellbeing.',
    benefits: ['Stress Adaptogens', 'Mind-Body Synchronization', 'Restorative Rest'],
    image: '/images/Yogic Balance.png'
  },
  {
    id: 'defense',
    title: 'Cellular Defense',
    subtitle: 'Everyday Protection. Elevated Skincare.',
    description: 'In the modern world, our bodies face unprecedented environmental stressors. Experience refined protection inspired by antioxidant-rich botanicals. Our cellular defense pillar focuses on neutralizing free radicals, supporting immune function, and promoting smoother, healthier-looking, radiant skin from the inside out.',
    benefits: ['Antioxidant Rich', 'Environmental Shield', 'Radiant Aging'],
    image: '/images/Cellular Defense.png'
  }
];

export default function AboutPhilosophy() {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Smooth crossfade effect handler
  const handleTabChange = (index) => {
    if (index === activeTab || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(index);
      setIsAnimating(false);
    }, 300); // Wait for fade out before switching content
  };

  const currentPillar = pillarsData[activeTab];

  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#14251b] pt-32 pb-24 overflow-x-hidden">
      
      {/* Header Section */}
      <div className="max-w-[1000px] mx-auto text-center px-6 md:px-12 mb-16">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-6">Our Philosophy</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#0f4d2c] leading-tight mb-6">
          The Four Pillars of <span className="italic text-gold-gradient">Healing</span>
        </h1>
        <p className="text-[#5d6b61] text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Nutriwell Organics operates on a 360-degree ecosystem. We do not just treat symptoms; we cultivate a lifestyle rooted in four foundational principles.
        </p>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Tab Navigation */}
        <div className="flex flex-nowrap overflow-x-auto hide-scrollbar border-b border-[#e6dfcc] mb-12 lg:justify-center gap-8 md:gap-16 pb-1">
          {pillarsData.map((pillar, index) => (
            <button
              key={pillar.id}
              onClick={() => handleTabChange(index)}
              className={`whitespace-nowrap pb-4 text-sm md:text-base font-medium tracking-[0.1em] uppercase transition-all duration-300 relative ${
                activeTab === index ? 'text-[#0a3520]' : 'text-[#5d6b61]/60 hover:text-[#b07f24]'
              }`}
            >
              {pillar.title}
              {/* Active Tab Indicator */}
              <span 
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#b07f24] transition-transform duration-500 origin-left ${
                  activeTab === index ? 'scale-x-100' : 'scale-x-0'
                }`} 
              />
            </button>
          ))}
        </div>

        {/* Content Area (Image & Text with Crossfade) */}
        <div 
          className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-opacity duration-500 ease-in-out ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          
          {/* Left: Premium Image Reveal */}
          <div className="relative h-[400px] md:h-[550px] w-full rounded-[2rem] overflow-hidden group shadow-[0_30px_60px_-20px_rgba(10,53,32,0.2)]">
            <img 
              src={currentPillar.image} 
              alt={currentPillar.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
            />
            {/* Dark elegant overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1813]/80 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8 text-[#fdfcf8]">
               <p className="text-[10px] tracking-[0.2em] uppercase text-[#e7c886] mb-2 font-semibold">Pillar No. 0{activeTab + 1}</p>
               <h3 className="font-display text-3xl">{currentPillar.title}</h3>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="py-6">
            <h2 className="font-display text-3xl md:text-4xl text-[#0a3520] mb-4">
              {currentPillar.subtitle}
            </h2>
            <div className="w-12 h-[1px] bg-[#b07f24] mb-8" />
            
            <p className="text-[#5d6b61] text-lg font-light leading-relaxed mb-10">
              {currentPillar.description}
            </p>

            <div className="space-y-4">
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#0a3520] font-semibold mb-4">Core Principles</h4>
              {currentPillar.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-full border border-[#e6dfcc] flex items-center justify-center group-hover:border-[#b07f24] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b07f24] opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[#3a4740] font-medium tracking-wide group-hover:text-[#0a3520] transition-colors">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* CSS for hiding scrollbar in tab nav on mobile */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}