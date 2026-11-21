"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Firebase Authentication sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Fetch User's Document from Firestore to verify their Role
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let role = 'customer'; // Default fallback role

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        role = userData.role || (userData.isAdmin ? 'admin' : (userData.isEmployee ? 'employee' : 'customer'));
      }

      // 3. Smart Routing based on Firestore Role
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'employee') {
        router.push('/employee');
      } else {
        router.push('/account');
      }

    } catch (err) {
      console.error("Login verification failed:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      } else {
        setErrorMsg('Authentication service unavailable. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-36 pb-20">
        <div className="w-full max-w-md bg-white border border-[#0f4d2c]/10 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <span className="text-[#b07f24] text-[10px] tracking-[0.3em] uppercase font-bold block mb-2">Nutriwell Access</span>
            <h1 className="text-3xl font-serif text-[#0f4d2c]">Sign In</h1>
            <p className="text-xs text-[#14251b]/60 mt-2">
              Enter your credentials to access your portal.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f4d2c]/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nutriwellorganics.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24] text-[#14251b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f4d2c]/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24] text-[#14251b]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#0f4d2c] hover:bg-[#0a3520] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Access Portal <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#0f4d2c]/10 pt-6">
            <p className="text-xs text-[#14251b]/60">
              Need assistance or registration?{' '}
              <Link href="/faqs" className="text-[#b07f24] font-bold hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}