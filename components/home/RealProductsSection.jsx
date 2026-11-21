'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { useCart } from '@/lib/cartContext';

export default function RealProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchRealProducts() {
      try {
        const q = query(collection(db, 'products'), limit(8));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(list);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchRealProducts();
  }, []);

  return (
    <section className="py-20 bg-[#fdfcf8] px-6 md:px-12 border-t border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#b07f24] uppercase font-bold">✦ Clinical Dispatch</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#0f4d2c] mt-1">Active Formulations</h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#b07f24] hover:underline">View All →</Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-400 font-mono text-xs">Syncing Dispensary...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <div key={p.id} className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
                <Link href={`/product/${p.slug || p.id}`} className="block relative h-64 bg-[#f6f2e7]/30 p-6">
                  <Image src={p.images?.[0] || p.image || '/logo1.svg'} alt={p.name} fill className="object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-serif font-bold text-[#0f4d2c] line-clamp-1">{p.name}</h3>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-50">
                    <span className="font-mono text-sm font-bold">₹{p.salePrice || p.price}</span>
                    <button onClick={() => addToCart({...p, quantity: 1})} className="px-4 py-1.5 bg-[#0f4d2c] text-white text-[10px] uppercase font-bold rounded-md hover:bg-[#145a34]">Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}