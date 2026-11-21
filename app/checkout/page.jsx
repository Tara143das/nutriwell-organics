"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Loader2, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart = [], cartItems = [], cartTotal = 0, clearCart, appliedCoupon } = useCart();
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod', // Cash on Delivery default
  });

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: user.displayName || '',
      }));
    }
  }, [user]);

  // Unified items check (cart or cartItems)
  const items = cartItems?.length ? cartItems : (cart || []);
  const shippingThreshold = 999;
  const baseShippingFee = 99;
  
  // Safe computation with fallback checks
  const shippingFee = (cartTotal >= shippingThreshold || (items?.length || 0) === 0) ? 0 : baseShippingFee;
  
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.discount) {
    discountAmount = Math.round((cartTotal * appliedCoupon.discount) / 100);
  }
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.uid || 'guest',
        customer: formData,
        items: items.map(item => ({
          id: item.id || '',
          name: item.name || '',
          price: Number(item.price) || 0,
          quantity: item.quantity || 1,
        })),
        subtotal: cartTotal,
        discount: discountAmount,
        shippingFee: shippingFee,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderPayload);
      clearCart();
      router.push(`/checkout/success?orderId=${docRef.id}`);
    } catch (err) {
      console.error("Order creation error:", err);
      alert("Unable to process order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0f4d2c] animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-[#fdfcf8]">
        <ShoppingBag className="w-16 h-16 text-[#0f4d2c]/30 mb-4" />
        <h1 className="text-3xl font-serif text-[#0f4d2c] mb-2">Your Apothecary Bag is Empty</h1>
        <p className="text-sm text-[#14251b]/60 mb-6">Explore our wildcrafted Vedic formulations to continue.</p>
        <Link href="/shop" className="bg-[#0f4d2c] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#0a3520] transition-all">
          Explore Formulations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#b07f24] text-[10px] tracking-[0.3em] uppercase font-bold block mb-2">Sacred Delivery</span>
          <h1 className="text-4xl font-serif text-[#0f4d2c]">Checkout & Dispatch</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Shipping Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-[#0f4d2c]/10 shadow-sm space-y-6">
            <h2 className="text-xl font-serif text-[#0f4d2c] border-b border-[#0f4d2c]/10 pb-4">Recipient Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-1">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Aarav Sharma" className="w-full px-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-1">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="aarav@example.com" className="w-full px-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24]" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-1">Phone Number</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className="w-full px-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24]" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-1">Shipping Address</label>
              <textarea required rows="3" name="address" value={formData.address} onChange={handleInputChange} placeholder="House / Flat No., Landmark, Street" className="w-full px-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-1">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" className="w-full px-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-1">State</label>
                <input required type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Maharashtra" className="w-full px-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-1">PIN Code</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="400001" className="w-full px-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24]" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#0f4d2c]/10">
              <span className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-3">Payment Method</span>
              <label className="flex items-center gap-3 p-4 border border-[#b07f24] bg-[#f6f2e7]/40 rounded-xl cursor-pointer">
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="text-[#0f4d2c]" />
                <span className="text-sm font-medium text-[#0f4d2c]">Cash on Delivery (COD) / Pay on Dispatch</span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#f6f2e7] p-8 rounded-3xl border border-[#0f4d2c]/10">
              <h2 className="text-xl font-serif text-[#0f4d2c] mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-[#0f4d2c]/5 pb-3">
                    <div>
                      <p className="font-medium text-[#0f4d2c] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-[#14251b]/50">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="font-semibold text-[#0f4d2c]">₹{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-[#0f4d2c]/10 pt-4">
                <div className="flex justify-between text-[#14251b]/70">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#b07f24]">
                    <span>Voucher Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#14251b]/70">
                  <span>Vedic Dispatch</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#0f4d2c] border-t border-[#0f4d2c]/10 pt-3">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-8 bg-[#0f4d2c] hover:bg-[#0a3520] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Confirm Order <ArrowRight className="w-4 h-4" /></>}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#14251b]/50">
                <ShieldCheck className="w-4 h-4 text-[#b07f24]" />
                <span>100% Ayurvedic Purity Guarantee</span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}