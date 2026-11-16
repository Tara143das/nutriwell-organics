'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { user, role, loading, login, signup, googleLogin } = useAuth()
  const router = useRouter()

  // MAGIC REDIRECT: User login korlei tar role check kore direct tar dashboard e pathabe
  useEffect(() => {
    if (user && !loading) {
      if (role === 'admin' || role === 'super_admin') {
        router.push('/admin/dashboard')
      } else if (role === 'employee') {
        router.push('/employee/dashboard')
      } else {
        router.push('/account')
      }
    }
  }, [user, role, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isSignUp) {
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
      // router.push() ekhane lagbe na, uporer useEffect automatic tar dashbaord e niye jabe
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/email-already-in-use') setError('Email already registered. Please Sign In.')
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setError('Invalid email or password. Try again.')
      else if (err.code === 'auth/user-not-found') setError('No account found. Please Sign Up.')
      else setError('Authentication failed. Please try again.')
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await googleLogin()
    } catch (err) {
      setError('Google Sign-in failed.')
    }
  }

  // User already login thakle jate form dubar na dekhay, loading spinner show korbe redirect howar aage
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[var(--cream)] border-t-[var(--gold)] rounded-full animate-spin"></div>
          <span className="font-sans text-[9px] uppercase tracking-[.3em] text-[var(--gold)]">Authenticating...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[var(--paper)] flex items-center justify-center relative overflow-hidden">
      
      {/* Background Aesthetic */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[var(--cream)]/50 to-transparent -z-10"></div>
      
      <div className="w-full max-w-md bg-white/60 border border-[var(--line)]/50 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-md">
        
        <div className="text-center mb-8">
          <span className="font-sans text-[9px] uppercase tracking-[.3em] text-[var(--gold)] font-medium">
            Nutriwell Portal
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--ink)] mt-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="font-sans text-xs text-[var(--muted)] mt-2">
            {isSignUp
              ? 'Join our holistic organic wellness sanctuary'
              : 'Sign in to access your dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50/50 border border-red-100 text-red-600 text-[11px] font-sans text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maharani Tara"
                className="w-full p-3.5 bg-white border border-[var(--line)]/50 rounded-xl text-xs outline-none focus:border-[var(--forest)] transition-colors placeholder:text-[var(--muted)]/40"
              />
            </div>
          )}

          <div>
            <label className="block font-sans text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-3.5 bg-white border border-[var(--line)]/50 rounded-xl text-xs outline-none focus:border-[var(--forest)] transition-colors placeholder:text-[var(--muted)]/40"
            />
          </div>

          <div>
            <label className="block font-sans text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3.5 bg-white border border-[var(--line)]/50 rounded-xl text-xs outline-none focus:border-[var(--forest)] transition-colors placeholder:text-[var(--muted)]/40"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-4 bg-[var(--forest)] text-white font-sans text-[10px] uppercase tracking-[.2em] rounded-full hover:bg-[var(--forest-deep)] transition-colors shadow-[0_8px_25px_-8px_rgba(15,77,44,.4)] disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In Securely'}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--line)]/40"></div>
          </div>
          <span className="relative px-4 bg-white/60 text-[9px] font-sans text-[var(--muted)] uppercase tracking-widest backdrop-blur-md">
            Or continue with
          </span>
        </div>

        <button
          onClick={handleGoogle}
          type="button"
          className="w-full py-3.5 px-4 rounded-full border border-[var(--line)] bg-white text-[11px] font-sans font-medium text-[var(--ink)] hover:border-[var(--gold)]/50 hover:bg-[var(--cream)]/30 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Google Single Sign-On
        </button>

        <div className="mt-8 text-center text-[11px] font-sans text-[var(--muted)]">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="text-[var(--forest)] font-medium hover:text-[var(--gold)] transition-colors ml-1 uppercase tracking-wider"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}