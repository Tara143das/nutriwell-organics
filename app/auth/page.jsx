'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/account'

  const { user } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  })

  // If already logged in, redirect automatically
  useEffect(() => {
    if (user) {
      router.push(redirectUrl)
    }
  }, [user, redirectUrl, router])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Sign In Existing User
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        router.push(redirectUrl)
      } else {
        // Create New Customer Account
        const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        const newUser = res.user

        // Save Customer Profile to Firestore
        await setDoc(doc(db, 'users', newUser.uid), {
          uid: newUser.uid,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          role: 'customer',
          createdAt: serverTimestamp()
        })

        router.push(redirectUrl)
      }
    } catch (err) {
      console.error('Auth Error:', err)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password credentials.')
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError(err.message || 'Authentication failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    const provider = new GoogleAuthProvider()

    try {
      const res = await signInWithPopup(auth, provider)
      const userDocRef = doc(db, 'users', res.user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: res.user.uid,
          fullName: res.user.displayName || 'Wellness Seeker',
          email: res.user.email,
          phone: res.user.phoneNumber || '',
          role: 'customer',
          createdAt: serverTimestamp()
        })
      }

      router.push(redirectUrl)
    } catch (err) {
      console.error('Google Sign-In Error:', err)
      setError('Failed to sign in with Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] pt-28 pb-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[var(--cream)]/80 border border-[var(--gold)]/30 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6">
        
        {/* Header Tabs */}
        <div className="text-center space-y-2">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] font-bold">
            Sacred Sanctuary Access
          </span>
          <h1 className="font-display text-3xl text-[var(--ink)] italic">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-full border border-[var(--line)]">
          <button
            onClick={() => { setIsLogin(true); setError('') }}
            className={`flex-1 py-2.5 rounded-full font-sans text-xs uppercase tracking-wider font-bold transition-all ${
              isLogin ? 'bg-[var(--forest)] text-white shadow-md' : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError('') }}
            className={`flex-1 py-2.5 rounded-full font-sans text-xs uppercase tracking-wider font-bold transition-all ${
              !isLogin ? 'bg-[var(--forest)] text-white shadow-md' : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-700 font-sans text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Radhika Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
              />
            </div>
          )}

          <div>
            <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="radhika@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
              />
            </div>
          )}

          <div>
            <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all shadow-xl disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Account' : 'Register Customer Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[var(--line)] w-full" />
          <span className="bg-[var(--cream)] px-3 text-[10px] font-sans text-[var(--muted)] uppercase tracking-widest font-bold">
            OR
          </span>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-white border border-[var(--line)] rounded-full font-sans text-xs font-semibold text-[var(--ink)] hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </main>
  )
}