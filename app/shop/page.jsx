"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
      } catch (error) {
        console.error("Error loading products from Firestore:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#fdfcf8] py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#0f4d2c] mb-3">Apothecary Shop</h1>
            <p className="text-[#14251b]/60 text-sm max-w-md">Clinically standardized Ayurvedic protocols for modern human optimization.</p>
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-[#0f4d2c] text-white shadow-sm' 
                      : 'bg-white text-[#0f4d2c] border border-[#0f4d2c]/10 hover:border-[#b07f24]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </header>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0f4d2c] animate-spin" />
            <span className="text-xs uppercase tracking-widest text-[#14251b]/50">Opening Dispensary...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center bg-[#f6f2e7] rounded-3xl p-12 border border-[#0f4d2c]/5">
            <p className="text-[#0f4d2c] font-serif text-2xl mb-2">No Formulations Available</p>
            <p className="text-[#14251b]/60 text-sm max-w-md mx-auto">
              Our apothecary is currently preparing fresh batches. Please check back shortly or access the admin panel to add active formulations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <Link href={`/product/${product.slug || product.id}`} key={product.id} className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#f6f2e7] mb-4 shadow-sm border border-[#0f4d2c]/5">
                  <Image 
                    src={product.imageUrl || product.images?.[0] || '/images/IMAGE1.png'} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur p-3 rounded-full shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ShoppingBag className="w-4 h-4 text-[#0f4d2c]" />
                  </div>
                </div>
                <div>
                  {product.category && (
                    <span className="text-[10px] text-[#b07f24] font-bold uppercase tracking-[0.2em] block mb-1">
                      {product.category}
                    </span>
                  )}
                  <h3 className="text-lg font-serif text-[#0f4d2c] group-hover:text-[#b07f24] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[#0f4d2c] font-semibold text-sm mt-1">
                    ₹{Number(product.price || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}