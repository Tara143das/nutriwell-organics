"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // Sign In
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        
        let role = 'customer';
        if (userDoc.exists()) {
          role = userDoc.data().role || 'customer';
        }

        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (role === 'employee') {
          router.push('/employee');
        } else {
          router.push(redirectUrl);
        }
      } else {
        // Sign Up
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: email.trim(),
          name: name.trim(),
          role: 'customer',
          createdAt: serverTimestamp(),
        });
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Please sign in.');
      } else {
        setErrorMsg('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-[#0f4d2c]/10 rounded-3xl p-8 md:p-10 shadow-xl">
      <div className="text-center mb-8">
        <span className="text-[#b07f24] text-[10px] tracking-[0.3em] uppercase font-bold block mb-2">
          Nutriwell Organics
        </span>
        <h1 className="text-3xl font-serif text-[#0f4d2c]">
          {isLogin ? 'Welcome Back' : 'Join The Circle'}
        </h1>
        <p className="text-xs text-[#14251b]/60 mt-2">
          {isLogin ? 'Access your Ayurvedic wellness account' : 'Begin your holistic wellness journey'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#0f4d2c] font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vaidya Sharma"
              className="w-full px-4 py-3 bg-[#fdfcf8] border border-[#0f4d2c]/15 rounded-xl text-sm focus:outline-none focus:border-[#b07f24] text-[#14251b]"
            />
          </div>
        )}

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
              placeholder="seeker@nutriwellorganics.com"
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
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMsg('');
          }}
          className="text-xs text-[#b07f24] font-semibold hover:underline"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already registered? Sign In"}
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-[#fdfcf8]">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0f4d2c] animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#14251b]/50">Loading Auth Portal...</span>
        </div>
      }>
        <AuthContent />
      </Suspense>
    </div>
  );
}