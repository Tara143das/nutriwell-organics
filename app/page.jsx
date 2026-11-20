'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/shop/ProductCard';
import IngredientsSection from '@/components/Ingredients';
import ShopByConcern from '@/components/home/ShopByConcern';
import LabTransparency from '@/components/home/LabTransparency';
import CountdownTimer from '@/components/home/CountdownTimer';
import PromoModal from '@/components/home/PromoModal';

/* ===================== HERO SLIDES ===================== */
const slides = [
  '/slides/SLIDE-1.mp4',
  '/slides/SLIDE-2.mp4',
  '/slides/SLIDE-3.mp4',
  '/slides/SLIDE-4.mp4',
  '/slides/SLIDE-5.mp4',
];
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;
const getSlideType = (src) => (VIDEO_EXT.test(src) ? 'video' : 'image');

/* ===================== DATA (NEW 4 PILLARS TEXT & IMAGES) ===================== */
const pillars = [
  {
    title: 'Sacred Botanicals',
    subtitle: 'Nature’s Ancient Wisdom. Refined for Modern Wellbeing.',
    text: 'Rooted in the timeless traditions of Ayurveda, our botanical philosophy celebrates carefully selected herbs and plant extracts to nurture vitality, restore balance, and support the body’s natural resilience.',
    img: '/images/Sacred Botanicals.png',
  },
  {
    title: 'Therapeutic Food',
    subtitle: 'Nourishment That Begins Within.',
    text: 'Discover the art of mindful nutrition through wholesome, nutrient-rich ingredients chosen to support digestive wellness, metabolic function, and the body’s natural equilibrium.',
    img: '/images/Therapeutic Food.png',
  },
  {
    title: 'Yogic Balance',
    subtitle: 'Move with Intention. Restore Your Inner Calm.',
    text: 'Embrace the harmony of mindful movement and conscious breathing to encourage relaxation, ease everyday stress, and cultivate a more restorative approach to rest and wellbeing.',
    img: '/images/Yogic Balance.png',
  },
  {
    title: 'Cellular Defense',
    subtitle: 'Everyday Protection. Elevated Skincare.',
    text: 'Experience refined skincare inspired by antioxidant-rich botanicals and thoughtfully selected ingredients, designed to help defend against environmental stressors while supporting smoother, healthier-looking, radiant skin.',
    img: '/images/Cellular Defense.png',
  },
];

const marqueeTop = ['Pure Ingredients', 'Ayurvedic Wisdom', 'Healthy Living', 'Sustainable Future', 'Holistic Wellness'];
const marqueeBottom = ['100% Natural', 'No Chemicals', 'Safe & Gentle', 'Holistic Wellness', 'Rooted in Tradition'];

/* ===================== HOOKS ===================== */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('is-visible'); io.unobserve(el); }
    }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Typewriter({ text, className = '', speed = 18 }) {
  const [out, setOut] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    setOut('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [started, text, speed]);

  return (
    <span ref={ref} className={className}>
      {out}<span className="text-[#b07f24] animate-pulse">|</span>
    </span>
  );
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ===================== PAGE ===================== */
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        if (!db) { setLoading(false); return; }
        const qFeatured = query(collection(db, 'products'), where('isFeatured', '==', true), where('isActive', '==', true), limit(1));
        const snapFeatured = await getDocs(qFeatured);
        if (!snapFeatured.empty) setFeaturedProduct({ id: snapFeatured.docs[0].id, ...snapFeatured.docs[0].data() });
        const qAll = query(collection(db, 'products'), where('isActive', '==', true), orderBy('createdAt', 'desc'), limit(8));
        const snapAll = await getDocs(qAll);
        if (!snapAll.empty) setProductsList(snapAll.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#14251b] overflow-x-hidden">

      {/* 1. HERO */}
      <section className="relative w-full h-[85vh] min-h-[480px] max-h-[860px] overflow-hidden bg-[#0a1813]">
        {slides.map((src, idx) => {
          const isActive = idx === currentSlide;
          const isNext = idx === (currentSlide + 1) % slides.length;
          return (
            <div key={src} className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              {getSlideType(src) === 'video' ? (
                <video className="w-full h-full object-cover" autoPlay={isActive} muted loop playsInline preload={isActive ? 'auto' : isNext ? 'metadata' : 'none'}><source src={src} type="video/mp4" /></video>
              ) : (
                <img src={src} alt="" className="w-full h-full object-cover" loading={isActive ? 'eager' : 'lazy'} fetchPriority={isActive ? 'high' : 'low'} decoding="async" />
              )}
            </div>
          );
        })}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#fdfcf8] to-transparent z-20 pointer-events-none" />
      </section>

      {/* 2. MARQUEE */}
      <section className="border-y border-[#e6dfcc]/80 bg-[#fdfcf8] py-5 overflow-hidden">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap px-4">
          {[...marqueeTop, ...marqueeTop].map((t, i) => (
            <span key={`a-${i}`} className="font-display text-2xl md:text-3xl text-[#0f4d2c] font-medium">{t} <span className="mx-8 text-[#b07f24]">✦</span></span>
          ))}
        </div>
      </section>

      {/* 3. ABOUT */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-[#fdfcf8]">
        <div className="max-w-[1320px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative rounded-[2rem] overflow-hidden border border-[#e6dfcc]/70 shadow-[0_30px_60px_-40px_rgba(10,53,32,0.35)] group">
              {/* IMAGE1.png Set for About Us */}
              <img src="/images/IMAGE1.png" alt="Nutriwell About" className="w-full h-[340px] md:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-4">About Us</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#0f4d2c] mb-6">About <span className="italic text-gold-gradient">Us</span></h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-[#5d6b61] text-[16px] md:text-[18px] leading-relaxed font-light max-w-2xl mb-8">
                <Typewriter text="Nutriwell Organics is committed to bringing the wisdom of Ayurveda into modern living. We create high-quality, natural and herbal products that support a healthy, balanced and happier life." speed={16} />
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. 4 PILLARS (Luxury Cinematic Image Reveal) */}
      <section className="pb-24 md:pb-32 px-6 md:px-12 lg:px-20 bg-[#fdfcf8]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-display text-[#14251b] mb-4">The <span className="text-[#b07f24] italic">Philosophy</span> of Healing</h2>
            <p className="text-[#5d6b61] text-lg max-w-2xl mx-auto font-light">Our holistic approach integrates the purest natural elements.</p>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="group relative rounded-[2rem] h-[450px] overflow-hidden shadow-md hover:shadow-[0_40px_80px_-20px_rgba(10,53,32,0.3)] transition-shadow duration-700 cursor-pointer">
                  
                  {/* Background Image */}
                  <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  
                  {/* Luxury Dark Overlay (Curtain Fade) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1813] via-[#0a1813]/60 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700 backdrop-blur-[2px] group-hover:backdrop-blur-sm" />

                  {/* Content Container */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    {/* Main Title - Always Visible */}
                    <h3 className="text-3xl font-display text-[#fdfcf8] mb-2 transform group-hover:-translate-y-2 transition-transform duration-700">
                      {p.title}
                    </h3>
                    
                    {/* Subtitle & Text - Cinematic Slide Up Reveal */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      <div className="overflow-hidden">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                          <p className="text-[#e7c886] font-semibold text-sm mb-3 mt-2 leading-relaxed">
                            {p.subtitle}
                          </p>
                          <p className="text-[#fdfcf8]/80 text-[13px] leading-relaxed font-light">
                            {p.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR AIMS (IMAGE2.png Set Here) */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-[#fdfcf8] border-t border-[#e6dfcc]/60">
        <div className="max-w-[1320px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="relative w-full h-[350px] md:h-[450px] lg:h-[520px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-20px_rgba(10,53,32,0.15)] group">
              {/* IMAGE2.png Set for Our Aims */}
              <img src="/images/IMAGE2.png" alt="Our Aims" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
          </Reveal>
          <Reveal delay={150} className="order-1 lg:order-2">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#b07f24] font-semibold mb-6">Our Aims</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[1.1] text-[#0a3520] mb-8">
              Ancient <span className="italic text-gold-gradient">Wisdom.</span><br />
              Modern <span className="italic text-gold-gradient">Science.</span>
            </h2>
            <div className="space-y-6 text-[#5d6b61] text-lg md:text-xl font-light leading-relaxed">
              <p>We exist at the intersection of timeless tradition and clinical precision.</p>
              <p>
                By blending the sacred healing of <span className="text-[#b07f24] font-medium">botanicals</span>, the restorative power of <span className="text-[#b07f24] font-medium">yogic practices</span>, and the purity of a <span className="text-[#b07f24] font-medium">nutrient-dense diet</span> with advanced science, we have created a holistic blueprint for a vibrant life.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. DYNAMIC "SHOP BY CONCERN" (Solution Finder) */}
      <ShopByConcern />

      {/* 6.5 SEASONAL BOTANICAL RESERVE COUNTDOWN TICKER */}
      <CountdownTimer />

      {/* 7. INGREDIENTS */}
      <IngredientsSection />

      {/* 8. LAB TRANSPARENCY & PURITY BAR */}
      <LabTransparency />

      {/* 9. FEATURED PRODUCT */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#f6f2e7] border-y border-[#e6dfcc]/70">
        <div className="max-w-[1320px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-4">Our Products</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#0f4d2c] mb-3">
              Apothecary <span className="italic text-gold-gradient">Spotlight</span>
            </h2>
          </Reveal>
          {loading ? (
            <div className="h-[460px] rounded-[2rem] bg-white/70 animate-pulse" />
          ) : featuredProduct ? (
            <Reveal>
              <div className="bg-white rounded-[2rem] border border-[#e6dfcc]/80 p-6 md:p-10 lg:p-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center shadow-[0_30px_70px_-45px_rgba(15,77,44,0.35)]">
                <div className="relative rounded-[1.75rem] bg-[#fdfcf8] border border-[#e6dfcc]/60 p-10 flex items-center justify-center min-h-[360px] group">
                  <img src={featuredProduct.images?.[0] || '/images/Sacred Botanicals.png'} alt={featuredProduct.name} className="max-h-[380px] w-auto object-contain transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="font-display text-3xl md:text-4xl text-[#14251b] leading-tight mb-4">{featuredProduct.name}</h3>
                  <p className="text-[15px] text-[#5d6b61] leading-relaxed font-light mb-8">{featuredProduct.description}</p>
                  <Link href={`/product/${featuredProduct.slug || featuredProduct.id}`}>
                    <span className="inline-flex items-center justify-center rounded-full bg-[#0a3520] text-[#fdfcf8] px-8 py-3.5 text-[12px] font-semibold tracking-[0.16em] uppercase hover:bg-[#0f4d2c] transition-colors">
                      Explore Product
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="rounded-[2rem] border border-[#e6dfcc] bg-white p-14 text-center">
              <h3 className="font-display text-2xl text-[#0f4d2c]">Formulations arriving soon</h3>
            </div>
          )}
        </div>
      </section>

      {/* 10. LUXURY PROMO POP-UP MODAL */}
      <PromoModal />

    </main>
  );
}