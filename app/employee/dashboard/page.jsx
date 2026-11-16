'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/lib/auth'

const EMPLOYEE_CARDS = [
  { title: 'Orders', desc: 'Process & track orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { title: 'Stock', desc: 'Update inventory levels', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { title: 'Queries', desc: 'Customer support tickets', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { title: 'Reports', desc: 'Daily & weekly summaries', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
]

function EmployeeDashboard() {
  const { user, logout } = useAuth()

  return (
    <main className="min-h-screen bg-[var(--paper)] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[.3em] text-[var(--gold)] mb-1">Employee Portal</p>
            <h1 className="font-display text-3xl text-[var(--ink)]">
              Hello, <span className="text-[var(--gold)] font-bold tracking-widest [text-shadow:0_0_12px_rgba(176,127,36,0.8)]">{user?.displayName?.split(' ')[0] || 'Team Member'}</span>
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2 border border-[var(--line)] rounded-full font-sans text-[11px] uppercase tracking-[.15em] text-[var(--muted)] hover:border-red-300 hover:text-red-500 transition-all duration-300"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {EMPLOYEE_CARDS.map(card => (
            <div
              key={card.title}
              className="p-6 bg-white/50 border border-[var(--line)]/50 rounded-2xl hover:shadow-[0_8px_30px_-10px_rgba(10,53,32,.1)] transition-all duration-300 cursor-pointer"
            >
              <svg className="w-6 h-6 text-[var(--forest)]/60 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                <path d={card.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="font-display text-lg text-[var(--ink)] mb-1">{card.title}</h3>
              <p className="font-sans text-[12px] text-[var(--muted)]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['employee', 'admin']}>
      <EmployeeDashboard />
    </ProtectedRoute>
  )
}