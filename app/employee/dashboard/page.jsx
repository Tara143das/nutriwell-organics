'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

const ADMIN_CARDS = [
  { 
    id: 'products',
    title: 'Products', 
    desc: 'Add, edit, remove products', 
    href: '/admin/products', 
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', 
    defaultCount: '0' 
  },
  { 
    id: 'orders',
    title: 'Orders', 
    desc: 'Manage customer orders & AWB tracking', 
    href: '/admin/orders', 
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 
    defaultCount: '0' 
  },
  { 
    id: 'marketing',
    title: 'Marketing & Popups', 
    desc: 'Harvest ticker, promo popup & combos', 
    href: '/admin/marketing', 
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', 
    defaultCount: 'Active' 
  },
  { 
    id: 'employees',
    title: 'Employees', 
    desc: 'Manage staff accounts & Auto IDs', 
    href: '/admin/employees', 
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', 
    defaultCount: '0' 
  },
  { 
    id: 'customers',
    title: 'Customers', 
    desc: 'View registered users & address book', 
    href: '/admin/customers', 
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', 
    defaultCount: '0' 
  },
  { 
    id: 'analytics',
    title: 'Analytics', 
    desc: 'Revenue & performance metrics', 
    href: '/admin/analytics', 
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 
    defaultCount: 'Live' 
  },
]

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [counts, setCounts] = useState({
    products: '—',
    orders: '—',
    employees: '—',
    customers: '—'
  })

  // Live Metrics Fetcher from Firestore
  useEffect(() => {
    async function fetchDashboardMetrics() {
      try {
        if (!db) return;

        // Fetch Products Count
        const productsSnap = await getDocs(collection(db, 'products'))
        
        // Fetch Orders Count
        const ordersSnap = await getDocs(collection(db, 'orders'))

        // Fetch Users/Customers & Employees
        const usersSnap = await getDocs(collection(db, 'users'))
        let customerCount = 0
        let employeeCount = 0

        usersSnap.forEach((docSnap) => {
          const data = docSnap.data()
          if (['admin', 'subadmin', 'sales', 'logistics'].includes(data.role)) {
            employeeCount++
          } else {
            customerCount++
          }
        })

        setCounts({
          products: String(productsSnap.size),
          orders: String(ordersSnap.size),
          employees: String(employeeCount),
          customers: String(customerCount)
        })
      } catch (err) {
        console.error('Error fetching dashboard counts:', err)
      }
    }

    fetchDashboardMetrics()
  }, [])

  return (
    <main className="min-h-screen bg-[var(--paper)] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[.3em] text-[var(--gold)] mb-1">Admin Portal</p>
            <h1 className="font-display text-3xl md:text-4xl text-[var(--ink)]">
              Welcome back, <span className="text-[var(--gold)] font-bold tracking-widest [text-shadow:0_0_12px_rgba(176,127,36,0.8)]">{user?.displayName?.split(' ')[0] || 'Admin'}</span>
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2 border border-[var(--line)] rounded-full font-sans text-[11px] uppercase tracking-[.15em] text-[var(--muted)] hover:border-red-300 hover:text-red-500 transition-all duration-300 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ADMIN_CARDS.map(card => {
            const displayCount = counts[card.id] !== undefined ? counts[card.id] : card.defaultCount;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group p-6 bg-white/50 border border-[var(--line)]/50 rounded-2xl hover:shadow-[0_12px_40px_-12px_rgba(10,53,32,.12)] hover:border-[var(--forest)]/30 transition-all duration-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <svg className="w-6 h-6 text-[var(--forest)]/60 group-hover:text-[var(--forest)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                    <path d={card.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-display text-2xl text-[var(--ink)]/20 group-hover:text-[var(--forest)]/40 transition-colors font-medium">
                    {displayCount}
                  </span>
                </div>
                <h3 className="font-display text-lg text-[var(--ink)] mb-1 group-hover:text-[var(--forest)] transition-colors">
                  {card.title}
                </h3>
                <p className="font-sans text-[12px] text-[var(--muted)]">{card.desc}</p>
              </Link>
            )
          })}
        </div>

      </div>
    </main>
  )
}

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'subadmin', 'sales', 'logistics']}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}