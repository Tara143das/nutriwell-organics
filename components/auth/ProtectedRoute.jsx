'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        // Jodi vul user onno dashboard e dhokar chesta kore, tobe take tar nijer dashboard e pathiye dewa hobe
        if (role === 'admin' || role === 'super_admin') router.push('/admin/dashboard')
        else if (role === 'employee') router.push('/employee/dashboard')
        else router.push('/account')
      } else {
        setIsChecking(false)
      }
    }
  }, [user, role, loading, router, allowedRoles])

  // Firebase theke Data ashar aage Luxury loading spinner dekhabe
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[var(--cream)] border-t-[var(--gold)] rounded-full animate-spin"></div>
          <span className="font-sans text-[9px] uppercase tracking-[.3em] text-[var(--gold)]">Verifying Access...</span>
        </div>
      </div>
    )
  }

  return children
}