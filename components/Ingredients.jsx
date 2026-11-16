'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const ingredientsData = [
  {
    title: 'Herbal Actives',
    items: 'Fennel, Cumin, Pudina, Ajwan, Camphor, Ginger.',
    bgImage: '/ingredients/card1.png', 
    theme: 'bg-[#F6EAD0]', 
  },
  {
    title: 'Base Oils',
    items: 'Moroccan Argan Oil, Extra Virgin Coconut Oil.',
    bgImage: '/ingredients/card2.png',
    theme: 'bg-[#EAEFEA]', 
  },
  {
    title: 'Essential Oils',
    items: 'Rosemary, Teatree, Lavender, Cedar Wood.',
    bgImage: '/ingredients/card3.png',
    theme: 'bg-[#FDFCF8]', 
  },
  {
    title: 'Marine Actives',
    items: 'Algae Oil, Pure Marine Extracts.',
    bgImage: '/ingredients/card4.png',
    theme: 'bg-[#EAEFEA]', 
  },
  {
    title: 'Botanical Extracts',
    items: 'Sea Buckthorn Oil, Flax Seed Oil, Ginko Biloba.',
    bgImage: '/ingredients/card5.png',
    theme: 'bg-[#F6EAD0]', 
  }
];

const IngredientCard = ({ data }) => {
  const [displayedText, setDisplayedText] = useState('');
  const typingInterval = useRef(null);
  const cardRef = useRef(null);

  const startTyping = () => {
    if (typingInterval.current) clearInterval(typingInterval.current);
    setDisplayedText('');
    let i = 0;
    typingInterval.current = setInterval(() => {
      if (i < data.items.length) {
        setDisplayedText(data.items.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval.current);
      }
    }, 50);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={startTyping}
      className={`group relative w-full h-[380px] lg:h-[450px] rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden cursor-pointer ${data.theme} transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(10,53,32,0.2)] border border-[#e6dfcc]/80`}
    >
      {/* TRUE WASHOUT LOOK */}
      <div className="absolute inset-0 z-0 opacity-[0.15] grayscale mix-blend-multiply pointer-events-none transition-all duration-1000 group-hover:opacity-[0.3] group-hover:scale-110">
        <Image 
          src={data.bgImage} 
          alt={data.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 pt-4">
        {/* Title Only, No Numbers, No Nature's Pharmacy */}
        <h3 className="font-display text-3xl xl:text-4xl text-[#14251b] leading-tight">
          {data.title}
        </h3>
      </div>

      <div className="relative z-10 pb-2">
        {/* Typewriter text size adjusted to fit card */}
        <p className="font-display text-xl xl:text-[22px] text-[#14251b] leading-[1.3]">
          {displayedText}
          <span className="text-[#b07f24] animate-pulse ml-1 font-sans">|</span>
        </p>
      </div>
    </div>
  );
};

export default function IngredientsSection() {
  return (
    <section className="py-24 bg-[#fdfcf8] overflow-hidden border-t border-[#e6dfcc]/40">
      <div className="max-w-[1400px] mx-auto px-6 mb-12 text-center md:text-left">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#b07f24] font-semibold mb-4">
          Botanical Alchemy
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#0f4d2c] leading-[1.1]">
          The ingredients behind <span className="text-gold-gradient italic">Nutriwell</span>
        </h2>
      </div>

      {/* 5-Column Grid Layout for Desktop (Fits all 5 perfectly) */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 pb-10">
        {ingredientsData.map((data, index) => (
          <IngredientCard key={index} data={data} />
        ))}
      </div>
    </section>
  );
}