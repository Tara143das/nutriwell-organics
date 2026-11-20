'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  Megaphone,
  Clock,
  Gift,
  Upload,
  Sparkles,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';

function MarketingManagementContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Promo Popup Form State
  const [promoPopup, setPromoPopup] = useState({
    active: true,
    imageUrl: '/images/IMAGE1.png',
    headline: 'Complimentary 10ml Saffron Elixir',
    subheadline: 'Unlock an exclusive apothecary welcome gift with your first order above ₹1,999.',
    couponCode: 'ROYAL20',
    discountPercentage: '20% OFF'
  });

  // 2. Countdown Offer Form State
  const [countdownOffer, setCountdownOffer] = useState({
    active: true,
    title: 'Kashmiri Mongra Saffron Fresh Reserve — Batch #72',
    subtitle: 'Supercritical cold extraction reserve ending soon. Once exhausted, next harvest cycle begins in Autumn.',
    endsAt: '',
    productSlug: 'kumkumadi-saffron-serum',
    stockRemaining: 27
  });

  // 3. Combos State
  const [combos] = useState([
    {
      id: 'gut-revival-bundle',
      title: 'Complete Gut Revival Ritual',
      badge: 'Save 25%',
      originalPrice: 3700,
      comboPrice: 2775,
      items: ['Triphala CO₂ Bio-Elixir', 'Wild Ginger Gut Nectar'],
      active: true
    },
    {
      id: 'keshya-royal-regimen',
      title: 'Royal Keshya Hair Density Regimen',
      badge: 'Best Value',
      originalPrice: 4200,
      comboPrice: 3150,
      items: ['100-Herb Mahabhringraj Oil', 'Amla Vitality Tonic'],
      active: true
    }
  ]);

  // Fetch Marketing Settings from Firestore `marketing/settings`
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        if (!db) return;

        const docRef = doc(db, 'marketing', 'settings');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.promoPopup) setPromoPopup(data.promoPopup);
          if (data.countdownOffer) setCountdownOffer(data.countdownOffer);
        } else {
          // Set default endsAt timestamp (4 days from now)
          const defaultEnds = new Date();
          defaultEnds.setDate(defaultEnds.getDate() + 4);
          const isoString = defaultEnds.toISOString().slice(0, 16);
          setCountdownOffer((prev) => ({ ...prev, endsAt: isoString }));
        }
      } catch (err) {
        console.error('Error fetching marketing settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Upload Promo Image
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!storage) {
      alert('Firebase Storage is not initialized.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `marketing/promo_${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        alert('Banner upload failed.');
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setPromoPopup((prev) => ({ ...prev, imageUrl: url }));
        setUploading(false);
        setUploadProgress(0);
      }
    );
  };

  // Save All Settings
  const handleSaveAll = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = {
        promoPopup,
        countdownOffer,
        combos,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'admin'
      };

      await setDoc(doc(db, 'marketing', 'settings'), payload, { merge: true });

      setSuccessMessage('Marketing & Promo configurations synced live!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving marketing settings:', err);
      alert('Failed to update marketing settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#fdfcf8]">
        <RefreshCw className="w-8 h-8 text-[#b07f24] animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#b07f24]">Loading Marketing Hub...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f4d2c]/30 border border-[#b07f24]/30 backdrop-blur-md shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b07f24]/20 border border-[#b07f24]/40 text-[#b07f24] text-[10px] uppercase font-bold tracking-widest mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            <span>High-Conversion Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#fdfcf8] font-light">
            Marketing & Dynamic Popup Manager
          </h1>
          <p className="text-xs text-[#fdfcf8]/70 mt-1 font-sans">
            Control homepage popups, countdown tickers, and curated ritual combos without touching code.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-[#b07f24] hover:bg-[#c9942b] text-[#0a1813] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(176,127,36,0.3)] flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Publish Live Marketing</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* SECTION 1: PROMO POPUP MODAL CONTROLLER */}
        <div className="bg-[#06120e] border border-[#b07f24]/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#b07f24]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0f4d2c] border border-[#b07f24]/40 text-[#b07f24]">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#fdfcf8]">
                  Homepage Promo Pop-Up Modal
                </h2>
                <p className="text-xs text-[#fdfcf8]/60">
                  Smart welcome pop-up triggered after 3.5 seconds with 24h dismissal logic.
                </p>
              </div>
            </div>

            {/* Active Toggle Switch */}
            <button
              type="button"
              onClick={() => setPromoPopup({ ...promoPopup, active: !promoPopup.active })}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
                promoPopup.active
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                  : 'bg-red-950/80 border-red-500 text-red-400'
              }`}
            >
              {promoPopup.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{promoPopup.active ? 'Pop-Up Active' : 'Pop-Up Inactive'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Banner Preview & PC Image Upload */}
            <div className="md:col-span-4 space-y-3">
              <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold">
                Promo Poster Image
              </label>

              <div className="relative aspect-[4/5] rounded-2xl bg-[#0a1813] border border-[#b07f24]/40 overflow-hidden group flex items-center justify-center">
                <img
                  src={promoPopup.imageUrl}
                  alt="Promo Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[#fdfcf8]">
                  {uploading ? (
                    <div className="text-center">
                      <RefreshCw className="w-6 h-6 text-[#b07f24] animate-spin mx-auto mb-1" />
                      <span className="text-xs font-mono">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-[#b07f24] mb-1" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Change Poster</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Inputs Column */}
            <div className="md:col-span-8 space-y-4">
              
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={promoPopup.headline}
                  onChange={(e) => setPromoPopup({ ...promoPopup, headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                  Subheadline / Body Text
                </label>
                <textarea
                  rows={2}
                  value={promoPopup.subheadline}
                  onChange={(e) => setPromoPopup({ ...promoPopup, subheadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={promoPopup.couponCode}
                    onChange={(e) => setPromoPopup({ ...promoPopup, couponCode: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs font-mono font-bold text-[#b07f24] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Discount Badge Text
                  </label>
                  <input
                    type="text"
                    value={promoPopup.discountPercentage}
                    onChange={(e) => setPromoPopup({ ...promoPopup, discountPercentage: e.target.value })}
                    placeholder="e.g. 20% OFF"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SECTION 2: SEASONAL BOTANICAL RESERVE COUNTDOWN TICKER */}
        <div className="bg-[#06120e] border border-[#b07f24]/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#b07f24]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0f4d2c] border border-[#b07f24]/40 text-[#b07f24]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#fdfcf8]">
                  Harvest Reserve Countdown Ticker
                </h2>
                <p className="text-xs text-[#fdfcf8]/60">
                  Homepage ticker displaying live countdown timer and batch scarcity units.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCountdownOffer({ ...countdownOffer, active: !countdownOffer.active })}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
                countdownOffer.active
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                  : 'bg-red-950/80 border-red-500 text-red-400'
              }`}
            >
              {countdownOffer.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{countdownOffer.active ? 'Ticker Active' : 'Ticker Hidden'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                Batch Reserve Title
              </label>
              <input
                type="text"
                value={countdownOffer.title}
                onChange={(e) => setCountdownOffer({ ...countdownOffer, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                Batch Expiry Date & Time *
              </label>
              <input
                type="datetime-local"
                value={countdownOffer.endsAt}
                onChange={(e) => setCountdownOffer({ ...countdownOffer, endsAt: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24] font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                Remaining Harvest Stock Counter
              </label>
              <input
                type="number"
                value={countdownOffer.stockRemaining}
                onChange={(e) => setCountdownOffer({ ...countdownOffer, stockRemaining: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CURATED RITUAL COMBOS */}
        <div className="bg-[#06120e] border border-[#b07f24]/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#b07f24]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0f4d2c] border border-[#b07f24]/40 text-[#b07f24]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#fdfcf8]">
                  Curated Ritual Combos (AOV Booster)
                </h2>
                <p className="text-xs text-[#fdfcf8]/60">
                  Pre-bundled botanical formulations offered at special bundle discounts.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {combos.map((combo, idx) => (
              <div
                key={combo.id || idx}
                className="p-4 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#fdfcf8]">{combo.title}</span>
                    <span className="px-2 py-0.5 rounded bg-[#b07f24]/20 border border-[#b07f24]/40 text-[#b07f24] text-[10px] font-bold">
                      {combo.badge}
                    </span>
                  </div>

                  <div className="text-xs text-[#fdfcf8]/60 mt-1">
                    Items: {combo.items.join(' + ')}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-[#fdfcf8]">₹{combo.comboPrice}</div>
                    <div className="text-[10px] text-[#fdfcf8]/50 line-through">₹{combo.originalPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
}

export default function MarketingManagementPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'subadmin']}>
      <MarketingManagementContent />
    </ProtectedRoute>
  );
}