'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Zap, 
  Flame, 
  Wind, 
  Droplets 
} from 'lucide-react';
import { useCart } from '@/lib/cartContext'; // Ensure cart trigger integration

// Dynamic Solution Finder Data - Extensible & Luxurious
const CONCERNS_DATA = [
  {
    id: 'gut-harmony',
    title: 'Gut Harmony & Digestion',
    subtitle: 'Deep Digestive Revival & Micro-biome Balance',
    dosha: 'Pitta & Kapha Pacifying',
    doshaIcon: Flame,
    colorAccent: '#b07f24',
    badge: 'Best Seller',
    product: {
      id: 'gut-revival-elixir',
      name: 'Triphala & Supercritical Ginger Bio-Elixir',
      tagline: '10:1 Cold-Pressed Supercritical CO₂ Extract',
      price: 1399,
      mrp: 1850,
      savings: 451,
      rating: 4.9,
      reviewsCount: 328,
      stockRemaining: 14,
      image: '/ingredients/card1.png',
      extractionMethod: 'Supercritical CO₂ Zero-Heat Extraction',
      doshaAlignment: 'Pacifies Agni Mandya & Bloating',
      keyIngredients: ['Organic Amla', 'Bibhitaki', 'Haritaki', 'CO₂ Ginger Extract'],
      sensoryProfile: 'Warm Woody Spices with Citrus Finish',
      shortDesc: 'Formulated using ancient Kashayam principles scaled with modern bio-fermentation. Eliminates Ama (toxins) and restores gut cellular lining.'
    }
  },
  {
    id: 'deep-sleep',
    title: 'Deep Sleep & Stress Relief',
    subtitle: 'Cellular Neural Calming & Cortisol Control',
    dosha: 'Vata Balancing',
    doshaIcon: Wind,
    colorAccent: '#0f4d2c',
    badge: 'Clinical Grade',
    product: {
      id: 'ashwagandha-sleep-nectar',
      name: 'KSM-66® Ashwagandha & Brahmi Nectar',
      tagline: 'High-Potency Full Spectrum Root Extract',
      price: 1599,
      mrp: 2100,
      savings: 501,
      rating: 5.0,
      reviewsCount: 412,
      stockRemaining: 8,
      image: '/ingredients/card2.png',
      extractionMethod: 'Hydro-Ethanol Triple Maceration',
      doshaAlignment: 'Soothes Elevated Vata & Sleeplessness',
      keyIngredients: ['KSM-66® Ashwagandha', 'Gotu Kola', 'Jatamansi', 'Cardamom'],
      sensoryProfile: 'Earthy Sweet Vanilla & Velvet Spices',
      shortDesc: 'Designed to reset circadian rhythm and reduce serum cortisol levels naturally without drowsiness or grogginess the next morning.'
    }
  },
  {
    id: 'hair-rejuvenation',
    title: 'Hair Roots & Scalp Vitality',
    subtitle: 'Follicle Anchorage & Anti-Hairfall Elixir',
    dosha: 'Pitta Cooling',
    doshaIcon: Droplets,
    colorAccent: '#b07f24',
    badge: 'Harvest Reserve',
    product: {
      id: 'bhringraj-keshya-oil',
      name: '100-Herb Mahabhringraj Royal Taila',
      tagline: 'Boiled in Milk for 21 Days (Kshirapaka Process)',
      price: 1799,
      mrp: 2400,
      savings: 601,
      rating: 4.95,
      reviewsCount: 589,
      stockRemaining: 19,
      image: '/ingredients/card3.png',
      extractionMethod: 'Traditional 21-Day Slow Kshirapaka',
      doshaAlignment: 'Cools Scalp Heat & Prevents Premature Graying',
      keyIngredients: ['Pure Bhringraj', 'Neem Seed Oil', 'Gunja', 'Goat Milk Base'],
      sensoryProfile: 'Rich Botanical Herbal Aromatics',
      shortDesc: 'Deep penetrating cold-pressed taila that revives dormant micro-follicles and strengthens root cortex from root-to-tip.'
    }
  },
  {
    id: 'radiant-skin',
    title: 'Radiant Skin & Youth Renewal',
    subtitle: 'Cellular Collagen Defense & Saffron Glow',
    dosha: 'Tridoshic Rejuvenator',
    doshaIcon: Zap,
    colorAccent: '#0f4d2c',
    badge: 'Royal Apothecary',
    product: {
      id: 'kumkumadi-saffron-serum',
      name: 'Kashmiri Kumkumadi Saffron Glow Elixir',
      tagline: 'Grade-A Kashmiri Mongra Saffron & Lotus Pollen',
      price: 2299,
      mrp: 2990,
      savings: 691,
      rating: 4.98,
      reviewsCount: 742,
      stockRemaining: 6,
      image: '/ingredients/card4.png',
      extractionMethod: 'Infused Warm Sesame Maceration',
      doshaAlignment: 'Balances Skin Complexion & Glow',
      keyIngredients: ['Kashmiri Mongra Saffron', 'Sandalwood', 'Manjistha', 'Padmaka'],
      sensoryProfile: 'Intense Floral Golden Saffron Notes',
      shortDesc: 'Miraculous night serum that fades hyperpigmentation, reduces dark circles, and imparts an unmistakable golden radiance.'
    }
  },
  {
    id: 'daily-immunity',
    title: 'Daily Immunity & Vitality',
    subtitle: 'Cellular Defense & Ojas Booster',
    dosha: 'Ojas Enhancing',
    doshaIcon: Sparkles,
    colorAccent: '#b07f24',
    badge: 'Essential Daily',
    product: {
      id: 'chyawanprash-rasayana-gold',
      name: 'Gold-Standard Swarna Chyawanprash',
      tagline: 'Wild Forest Amla & 24K Edible Gold Bhasma',
      price: 1899,
      mrp: 2500,
      savings: 601,
      rating: 4.92,
      reviewsCount: 215,
      stockRemaining: 22,
      image: '/ingredients/card5.png',
      extractionMethod: 'Hand-Churned Organic A2 Ghee Base',
      doshaAlignment: 'Rebuilds Vital Energy & Cellular Immunity',
      keyIngredients: ['Wild Organic Amla', 'Swarna Bhasma', 'Pippali', 'A2 Gir Cow Ghee'],
      sensoryProfile: 'Rich Tangy Honey-Spiced Jam',
      shortDesc: 'Ancient Rasayana formulation designed to boost macrophage defense, improve respiratory endurance, and enhance overall Ojas.'
    }
  }
];

export default function ShopByConcern() {
  const [activeConcernId, setActiveConcernId] = useState(CONCERNS_DATA[0].id);
  const { addToCart, openCart } = useCart ? useCart() : { addToCart: () => {}, openCart: () => {} };
  const [added, setAdded] = useState(false);

  const activeData = CONCERNS_DATA.find((c) => c.id === activeConcernId) || CONCERNS_DATA[0];
  const product = activeData.product;

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        image: product.image,
        quantity: 1
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    if (openCart) openCart();
  };

  return (
    <section className="py-20 md:py-28 bg-[#fdfcf8] text-[#14251b] relative overflow-hidden border-t border-[#b07f24]/20">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b07f24]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0f4d2c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f6f2e7] border border-[#b07f24]/30 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#b07f24]" />
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#0f4d2c]">
              Curated Solution Finder
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#0f4d2c] font-light tracking-tight leading-tight">
            Targeted Healing by <span className="italic font-normal text-[#b07f24]">Dosha Vitality</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#14251b]/80 font-sans leading-relaxed">
            Select your health concern to reveal ultra-potent, clinical-grade botanical extractions tailored to restore cellular equilibrium.
          </p>
        </div>

        {/* Dynamic Concern Selector Tabs (Horizontal Scroll on Mobile) */}
        <div className="flex items-center justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto pb-4 mb-12 scrollbar-none px-2">
          {CONCERNS_DATA.map((item) => {
            const isActive = item.id === activeConcernId;
            const DoshaIcon = item.doshaIcon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveConcernId(item.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap border shrink-0 ${
                  isActive
                    ? 'bg-[#0f4d2c] text-[#fdfcf8] border-[#b07f24] shadow-[0_8px_25px_rgba(15,77,68,0.25)] scale-[1.02]'
                    : 'bg-[#f6f2e7]/80 text-[#14251b] border-[#b07f24]/20 hover:border-[#b07f24]/60 hover:bg-[#f6f2e7]'
                }`}
              >
                <DoshaIcon className={`w-4 h-4 ${isActive ? 'text-[#b07f24]' : 'text-[#0f4d2c]'}`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Product Spotlight Container */}
        <div className="bg-[#f6f2e7] border border-[#b07f24]/30 rounded-2xl p-6 sm:p-8 md:p-12 shadow-[0_15px_40px_rgba(15,77,44,0.06)] relative transition-all duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Image Spotlight Column */}
            <div className="lg:col-span-5 relative group">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#fdfcf8] border border-[#b07f24]/20 shadow-inner">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-contain p-6 transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                
                {/* Badge Top Left */}
                <div className="absolute top-4 left-4 bg-[#0f4d2c] text-[#fdfcf8] text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-[#b07f24] shadow-md font-semibold">
                  {activeData.badge}
                </div>

                {/* Scarcity Tag Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-[#fdfcf8]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#b07f24]/40 text-[11px] font-medium text-[#14251b] shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Only {product.stockRemaining} harvest bottles left
                </div>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              <div>
                {/* Dosha & Extraction Tag */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-[#b07f24]/10 text-[#b07f24] text-xs font-semibold rounded-md border border-[#b07f24]/30">
                    {activeData.dosha}
                  </span>
                  <span className="text-xs text-[#14251b]/70 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0f4d2c]" />
                    {product.extractionMethod}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-2xl sm:text-3xl font-serif text-[#0f4d2c] font-light leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#b07f24] font-medium mt-1 uppercase tracking-wider">
                  {product.tagline}
                </p>

                {/* Rating & Efficacy */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center text-amber-500">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-xs font-semibold text-[#14251b]">
                    {product.rating} / 5.0
                  </span>
                  <span className="text-xs text-[#14251b]/60">
                    ({product.reviewsCount} verified apothecary reviews)
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-[#14251b]/80 leading-relaxed font-sans">
                  {product.shortDesc}
                </p>

                {/* Key Ingredients Golden Chips */}
                <div className="mt-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0f4d2c] block mb-2.5">
                    Botanical Composition:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.keyIngredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#fdfcf8] text-[#14251b] border border-[#b07f24]/30 shadow-2xs"
                      >
                        <Leaf className="w-3 h-3 text-[#0f4d2c]" />
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sensory Profile Note */}
                <div className="mt-4 p-3 rounded-lg bg-[#fdfcf8]/60 border border-[#b07f24]/20 text-xs text-[#14251b]/80 flex items-center gap-2">
                  <span className="font-semibold text-[#0f4d2c]">Sensory Profile:</span>
                  <span>{product.sensoryProfile}</span>
                </div>
              </div>

              {/* Price & Add To Cart CTA Row */}
              <div className="mt-8 pt-6 border-t border-[#b07f24]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Pricing Box */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-serif font-semibold text-[#0f4d2c]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-base text-[#14251b]/50 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#b07f24]/15 text-[#b07f24] text-xs font-bold border border-[#b07f24]/30">
                      Save ₹{product.savings}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#14251b]/60 block mt-0.5">
                    Inclusive of all taxes • Free Shipping Across India
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto px-8 py-4 bg-[#0f4d2c] hover:bg-[#0a3520] text-[#fdfcf8] rounded-xl font-medium text-sm transition-all duration-300 shadow-[0_8px_20px_rgba(15,77,44,0.2)] hover:shadow-[0_12px_28px_rgba(15,77,44,0.3)] flex items-center justify-center gap-3 border border-[#b07f24]/40 group cursor-pointer"
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#b07f24] animate-bounce" />
                      <span>Added to Apothecary Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 text-[#b07f24] group-hover:scale-110 transition-transform" />
                      <span>Add to Apothecary Cart</span>
                      <ArrowRight className="w-4 h-4 text-[#fdfcf8]/70 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}