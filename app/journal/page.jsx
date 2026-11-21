"use client";
import React, { useState } from 'react';
import { Search, Clock, ArrowRight, X } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    category: "Rituals",
    title: "The Dinacharya Guide: Daily Ayurvedic Rhythms",
    excerpt: "Aligning your body's clock with the solar cycle for optimal cellular energy and mental clarity.",
    readTime: "8 min read",
    content: "Dinacharya is the Ayurvedic practice of a daily routine that maintains the balance of the three doshas. It involves waking up before sunrise, cleansing the senses, and mindful nourishment...",
    image: "/images/IMAGE1.png"
  },
  {
    id: 2,
    category: "Formulations",
    title: "Beyond Ashwagandha: The Power of Adaptogens",
    excerpt: "How modern clinical science validates ancient rasayana herbs for stress and immunity.",
    readTime: "12 min read",
    content: "Adaptogens are a unique class of healing plants that help balance, restore, and protect the body. We explore the synergy between KSM-66 and traditional forest-harvested herbs...",
    image: "/images/IMAGE2.png"
  }
];

export default function JournalPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = ARTICLES.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfcf8] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <span className="text-[#b07f24] font-medium tracking-[0.2em] uppercase text-xs block mb-3">The Ayurvedic Chronicle</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#0f4d2c] mb-6">Journal of Life</h1>
          
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0f4d2c]/40 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search traditions, science, or rituals..."
              className="w-full pl-11 pr-5 py-3 bg-white border border-[#0f4d2c]/10 rounded-full focus:outline-none focus:border-[#b07f24] text-sm text-[#0f4d2c]"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredArticles.map((article) => (
            <article 
              key={article.id}
              className="group cursor-pointer bg-[#f6f2e7] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                  <span className="text-[10px] font-bold text-[#0f4d2c] tracking-widest uppercase">{article.category}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-3 text-[#0f4d2c]/60 text-xs">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                </div>
                <h3 className="text-2xl font-serif text-[#0f4d2c] mb-3 group-hover:text-[#b07f24] transition-colors">
                  {article.title}
                </h3>
                <p className="text-[#14251b]/70 leading-relaxed text-sm mb-6">{article.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-[#0f4d2c] font-bold uppercase tracking-wider text-xs">
                  Read Article <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a1813]/80 backdrop-blur-sm" onClick={() => setSelectedArticle(null)} />
          <div className="relative bg-[#fdfcf8] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 md:p-10">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 hover:bg-[#f6f2e7] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#0f4d2c]" />
            </button>
            <span className="text-[#b07f24] font-bold uppercase tracking-widest text-xs">{selectedArticle.category}</span>
            <h2 className="text-3xl font-serif text-[#0f4d2c] mt-2 mb-6">{selectedArticle.title}</h2>
            <img src={selectedArticle.image} className="w-full aspect-video object-cover rounded-xl mb-6" alt="" />
            <div className="text-[#14251b]/80 text-sm leading-relaxed space-y-4">
              <p>{selectedArticle.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}