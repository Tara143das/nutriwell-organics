'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const JOURNAL_ARTICLES = [
  {
    id: 'ojas-cellular-radiance',
    title: 'The Architecture of Ojas: How Ancient Rasayana Rebuilds Cellular Longevity',
    category: 'Cellular Defense',
    readTime: '6 min read',
    date: 'November 20, 2026',
    author: 'Vaidya Dr. Arindam Sen, BAMS & Senior Phytochemist',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'In classical Ayurveda, Ojas is not merely an abstract concept of vitality; it is the physical and bio-energetic essence of tissue transformation (Dhatu Paka). Modern cellular biology calls it mitochondrial efficiency.',
    content: `
      In the Charaka Samhita, Ojas is described as the supreme honey-like substance that resides in the heart and permeates the micro-channels (Srotas) of the human body. When Ojas is robust, cellular apoptosis is modulated, DNA repair mechanisms are stabilized, and the body resists pathogenic stressors effortlessly.

      ### The Seven Dhatus and Cellular Metabolism
      The food we ingest undergoes seven sequential metabolic fires (Dhatu Agni). From Rasa (plasma) to Rakta (blood), Mamsa (muscle), Meda (adipose), Asthi (bone), Majja (marrow), and finally Shukra (reproductive essence) — the ultimate refined distillate of this 30-day biological refinement cycle is Ojas.

      ### Modern Scientific Intersection: Mitophagy & Sirtuins
      Recent research into adaptogenic botanicals like Ashwagandha (Withania somnifera) and Guduchi (Tinospora cordifolia) reveals that their active withanolides and polysaccharides activate SIRT1 and AMPK pathways. These are the very enzymatic triggers responsible for cellular autophagy—clearing senescent cellular debris and preserving mitochondrial membrane potential.

      ### 3 Daily Rituals to Preserve Ojas:
      1. **Brahma Muhurta Hydration:** Drink 200ml of copper-rested lukewarm water with crushed cardamom at sunrise.
      2. **Avoid Mandagni Dinners:** Conclude your last meal before 7:30 PM to prevent toxic metabolic intermediate (Ama) buildup.
      3. **Nasya Therapy:** Apply 2 drops of pure A2 cow ghee into each nostril before bed to lubricate the craniosacral pathway and soothe Prana Vata.
    `,
  },
  {
    id: 'therapeutic-food-ahara',
    title: 'Ahara as Sacred Medicine: Restoring Gut Agni Through Six-Taste Alchemy',
    category: 'Therapeutic Food',
    readTime: '8 min read',
    date: 'November 18, 2026',
    author: 'Sunetra Ghosh, Ayurvedic Nutritionist',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'True nourishment is never calibrated merely in raw calories or isolated macronutrients. The Shad Rasa (six sacred tastes) act as chemical switches that trigger enzymatic secretions throughout the digestive tract.',
    content: `
      Modern dietary dogma frequently reduces food to an arithmetic equation: calories in versus calories out. Ayurveda teaches that food devoid of Prana or consumed against one's bio-constitution acts as a slow metabolic poison known as Ama.

      ### The Law of the Six Tastes (Shad Rasa)
      A therapeutically balanced meal must harmonize six elemental tastes:
      - **Madhura (Sweet):** Grounds nervous energy (Earth + Water).
      - **Amla (Sour):** Kindles gastric hydrochloric secretion (Earth + Fire).
      - **Lavana (Salty):** Maintains electrolytic balance (Water + Fire).
      - **Katu (Pungent):** Stimulates micro-capillary circulation (Fire + Air).
      - **Tikta (Bitter):** Cleanses hepatobiliary congestion (Air + Ether).
      - **Kashaya (Astringent):** Tones mucosal barriers (Air + Earth).

      When all six tastes are present in unrefined forms, leptin and ghrelin satiety cues reset naturally, eliminating unnatural cravings and emotional snacking.
    `,
  },
  {
    id: 'somatic-pranayama-vagus-nerve',
    title: 'The Vagus Nerve & Nadi Shodhana: The Biomechanics of Yogic Breath',
    category: 'Yogic Balance',
    readTime: '5 min read',
    date: 'November 15, 2026',
    author: 'Acharya Rajeshwar, Lead Yogic Master',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Why does alternate nostril breathing downregulate sympathetic fight-or-flight within 180 seconds? An exploration of baroreceptor reflex and the autonomic nervous system.',
    content: `
      Long before functional MRI studies documented brain hemisphere coherence, the Hatha Yoga Pradipika mapped the Pingala (solar, sympathetic) and Ida (lunar, parasympathetic) nadis converging at the Ajna chakra.

      ### The Baroreflex Connection
      When you breathe exclusively through the left nostril, cardiac output slightly decelerates, vagal tone increases, and acetylcholine is released into the myocardium. When alternate nostril breathing (Nadi Shodhana) is practiced with a 1:1 or 1:2 inhalation-to-exhalation cadence, heart rate variability (HRV) immediately jumps into coherent resonant rhythm.

      ### Morning Practice Protocol:
      - Sit upright with pelvis higher than knees using a zafu cushion.
      - Nasagra Mudra with right hand.
      - 5 rounds of gentle anulom vilom without breath retention (Kumbhaka).
      - Conclude with 3 long resonant Bhramari humming breaths to stimulate nitric oxide release in the paranasal sinuses.
    `,
  },
  {
    id: 'wildcrafted-botanicals-potency',
    title: 'The High-Altitude Apothecary: Why Wildcrafted Herbs Outperform Farmed Extracts',
    category: 'Sacred Botanicals',
    readTime: '7 min read',
    date: 'November 10, 2026',
    author: 'Nutriwell Botanical Research Labs',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'When a medicinal botanical survives sub-zero Himalayan blizzards and intense UV exposure, its survival secondary metabolites surge by up to 340% compared to greenhouse-cultivated crops.',
    content: `
      Botanicals do not produce therapeutic phytocompounds for human entertainment; they produce them as immune defense mechanisms against severe environmental adversity.

      ### The Stress-Induced Polyphenolic Surge
      A Kutki (Picrorhiza kurroa) rhizome gathered at 3,800 meters altitude in Himachal Pradesh synthesizes exponentially higher concentrations of kutkin and picroside I & II compared to plains-cultivated varieties. The extreme thermal oscillation between day and night triggers protective antioxidant defenses in the plant’s cellular wall.

      ### Our Ethical Foraging Standard
      At Nutriwell Organics, our master tribal foragers follow the traditional Charaka code:
      - Herbs are harvested only during their peak astrological and seasonal window (Ritu Charya).
      - Never harvest more than 30% of a wild patch to preserve root regenerative cycles.
      - Offerings and prayers of gratitude are returned to the soil prior to root extraction.
    `,
  },
];

export default function JournalPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ['All', 'Sacred Botanicals', 'Therapeutic Food', 'Yogic Balance', 'Cellular Defense'];

  const filteredArticles = JOURNAL_ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#14251b] pt-28 pb-24 font-sans selection:bg-[#b07f24] selection:text-white">
      
      {/* 1. HERO EDITORIAL HEADER */}
      <section className="relative px-6 md:px-12 max-w-7xl mx-auto pt-6 pb-12 border-b border-[#b07f24]/20">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#b07f24] font-semibold bg-[#b07f24]/10 px-3.5 py-1 rounded-full border border-[#b07f24]/30 inline-block">
            Vedic Chronicles & Botanical Science
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#0f4d2c] tracking-tight leading-tight">
            The Nutriwell Journal
          </h1>
          <p className="text-stone-600 font-sans text-sm md:text-base leading-relaxed">
            Ancient Ayurvedic codices decoded through modern clinical biochemistry. Peer-reviewed insights on longevity, cellular defense, and sacred living.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                  selectedCategory === cat
                    ? 'bg-[#0f4d2c] text-white shadow-md'
                    : 'bg-[#f6f2e7] text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search botanical wisdom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-full bg-white border border-stone-300 focus:border-[#b07f24] outline-none shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 2. ARTICLES GRID */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="group bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-[#0a1813]/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-mono text-[#b07f24] border border-[#b07f24]/30">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-3">
                  <div className="flex items-center space-x-3 text-xs text-stone-400 font-mono">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-serif text-[#0a3520] group-hover:text-[#b07f24] transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-stone-600 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 md:px-8 pb-6 pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-sans italic">
                  By {article.author.split(',')[0]}
                </span>

                <button
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-bold text-[#0f4d2c] hover:text-[#b07f24] transition-colors"
                >
                  <span>Read Chronicle</span>
                  <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-500 font-serif text-lg">No chronicles matched your search criteria.</p>
          </div>
        )}
      </section>

      {/* 3. FULL ARTICLE READING MODAL (Deep Reader Experience) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#fdfcf8] max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-[#b07f24]/40 p-6 md:p-10 relative custom-scrollbar">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono tracking-widest uppercase text-[#b07f24] font-semibold bg-[#b07f24]/10 px-3 py-0.5 rounded-full border border-[#b07f24]/20 inline-block mb-3">
              {activeArticle.category}
            </span>

            <h1 className="text-2xl md:text-4xl font-serif text-[#0f4d2c] mb-3 leading-tight">
              {activeArticle.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-mono pb-6 border-b border-stone-200 mb-6">
              <span>{activeArticle.author}</span>
              <span>•</span>
              <span>{activeArticle.date}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="relative h-72 w-full rounded-xl overflow-hidden mb-8 shadow-inner">
              <Image
                src={activeArticle.image}
                alt={activeArticle.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Markdown-style Clean Editorial Content */}
            <div className="prose prose-stone text-sm md:text-base leading-relaxed text-[#14251b] space-y-4 font-sans whitespace-pre-line">
              {activeArticle.content}
            </div>

            <div className="mt-10 pt-6 border-t border-[#b07f24]/30 flex justify-between items-center">
              <span className="text-xs text-stone-500 italic">Nutriwell Botanical Journal • Open Science Archives</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-lg bg-[#0f4d2c] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#145a34]"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. NEWSLETTER / SACRED DISPATCH */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mt-24">
        <div className="bg-[#0a1813] text-[#fdfcf8] p-8 md:p-12 rounded-2xl border border-[#b07f24]/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#b07f24]">The Weekly Ayurvedic Dispatch</span>
          <h3 className="text-2xl md:text-3xl font-serif text-[#f6f2e7]">Receive Clinical Wisdom Straight to Your In-box</h3>
          <p className="text-stone-300 text-xs md:text-sm max-w-xl mx-auto">
            No spam, no aggressive upselling. Only unadulterated Rasayana recipes, seasonal dosha guides, and peer-reviewed botanical discoveries.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Blessings! You have been subscribed to the Nutriwell Dispatch.'); }} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your sacred email..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white outline-none focus:border-[#b07f24]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#b07f24] to-[#8c641d] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}