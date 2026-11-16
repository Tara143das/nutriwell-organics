'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

export default function CustomerAccountPage() {
  const { user, logout } = useAuth()
  
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: 'Home', // Home or Office
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  })

  // Load Addresses from Firestore
  useEffect(() => {
    if (user?.uid) {
      const fetchAddresses = async () => {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists() && docSnap.data().addresses) {
          setAddresses(docSnap.data().addresses)
        }
      }
      fetchAddresses()
    }
  }, [user])

  // Save New Address
  const handleSaveAddress = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const newAddress = { ...formData, id: Date.now().toString() }
      const userRef = doc(db, 'users', user.uid)
      
      await updateDoc(userRef, {
        addresses: arrayUnion(newAddress)
      })
      
      setAddresses([...addresses, newAddress])
      setShowAddressForm(false)
      setFormData({ title: 'Home', fullName: '', phone: '', street: '', city: '', state: '', pincode: '' })
    } catch (error) {
      console.error("Error saving address:", error)
      alert("Failed to save address.")
    } finally {
      setSaving(false)
    }
  }

  // Delete Address
  const handleDeleteAddress = async (addressToRemove) => {
    if(!confirm("Delete this address?")) return
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        addresses: arrayRemove(addressToRemove)
      })
      setAddresses(addresses.filter(a => a.id !== addressToRemove.id))
    } catch (error) {
      console.error("Error deleting address:", error)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['customer', 'admin', 'employee', 'super_admin']}>
      <div className="min-h-screen pt-32 pb-24 px-5 md:px-10 bg-[var(--paper)]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header Banner */}
          <div className="bg-[var(--cream)]/40 rounded-[2rem] p-8 md:p-12 border border-[var(--line)]/40 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[.3em] text-[var(--gold)] font-medium">
                Customer Sanctuary
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-[var(--ink)] mt-2 tracking-tight">
                Welcome, <span className="text-[var(--gold)] font-bold tracking-widest [text-shadow:0_0_12px_rgba(176,127,36,0.8)]">{user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}</span>
              </h1>
              <p className="font-sans text-xs text-[var(--muted)] mt-3 tracking-wide">
                Manage your holistic wellness journey and ancient remedies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--forest)] text-white font-sans text-[11px] uppercase tracking-[.2em] hover:bg-[var(--ink)] transition-colors text-center shadow-sm"
              >
                New Purchase
              </Link>
              <button
                onClick={logout}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[var(--line)] text-[var(--ink)] font-sans text-[11px] uppercase tracking-[.2em] hover:border-[var(--ink)] transition-colors text-center"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Old Purchase Records */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-end justify-between border-b border-[var(--line)]/40 pb-4">
                <h2 className="font-display text-2xl text-[var(--ink)]">Purchase Records</h2>
                <span className="font-sans text-[10px] uppercase tracking-[.2em] text-[var(--muted)]">0 Orders</span>
              </div>

              <div className="bg-white/50 rounded-3xl border border-[var(--line)]/30 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--cream)] flex items-center justify-center border border-[var(--gold)]/20">
                  <svg className="w-6 h-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl text-[var(--ink)] mb-2">No Past Purchases</h3>
                <p className="font-sans text-xs text-[var(--muted)] max-w-sm mx-auto leading-relaxed mb-6">
                  You haven't placed any orders yet. Discover our ancient Ayurvedic formulations to begin your journey.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 rounded-full border border-[var(--gold)]/50 text-[var(--forest)] font-sans text-[10px] uppercase tracking-[.2em] hover:bg-[var(--gold)]/10 transition-colors"
                >
                  Explore Catalog
                </Link>
              </div>
            </div>

            {/* Account Details & Addresses */}
            <div className="space-y-8">
              
              {/* Profile Card */}
              <div>
                <h2 className="font-display text-2xl text-[var(--ink)] border-b border-[var(--line)]/40 pb-4 mb-6">Profile Details</h2>
                <div className="bg-[var(--cream)]/30 rounded-3xl border border-[var(--line)]/40 p-6 space-y-5">
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-[.2em] text-[var(--muted)] mb-1">Email Address</p>
                    <p className="font-sans text-sm text-[var(--ink)]">{user?.email}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-[.2em] text-[var(--muted)] mb-1">Account Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="font-sans text-xs text-[var(--ink)] font-medium">Verified Member</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Book */}
              <div>
                <div className="flex items-end justify-between border-b border-[var(--line)]/40 pb-4 mb-6">
                  <h2 className="font-display text-2xl text-[var(--ink)]">Saved Addresses</h2>
                  <button onClick={() => setShowAddressForm(true)} className="font-sans text-[10px] uppercase tracking-[.2em] text-[var(--forest)] hover:text-[var(--gold)] transition-colors">
                    + Add New
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="bg-white/50 rounded-3xl border border-[var(--line)]/40 p-6 text-center">
                      <p className="font-sans text-xs text-[var(--muted)] italic py-2">
                        No addresses saved. Add one for faster checkout.
                      </p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div key={addr.id} className="bg-white/50 rounded-2xl border border-[var(--line)]/40 p-5 relative group hover:border-[var(--gold)]/40 transition-colors">
                        <span className="absolute top-4 right-5 font-sans text-[8px] uppercase tracking-widest text-[var(--gold)] bg-[var(--cream)] px-2 py-1 rounded">
                          {addr.title}
                        </span>
                        <p className="font-display text-[15px] text-[var(--ink)] mb-1 pr-12">{addr.fullName}</p>
                        <p className="font-sans text-[11px] text-[var(--muted)] leading-relaxed">
                          {addr.street},<br/>{addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="font-sans text-[11px] text-[var(--muted)] mt-2">Phone: {addr.phone}</p>
                        
                        <button 
                          onClick={() => handleDeleteAddress(addr)}
                          className="mt-4 font-sans text-[10px] text-red-400 hover:text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--paper)] max-w-lg w-full rounded-[2rem] p-8 shadow-2xl relative border border-[var(--line)]">
            <button onClick={() => setShowAddressForm(false)} className="absolute top-6 right-6 text-[var(--muted)] hover:text-black">
              ✕
            </button>
            <h3 className="font-display text-2xl text-[var(--ink)] mb-6">Add New Address</h3>
            
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Save As</label>
                  <select 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 bg-white/50 border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Full Name</label>
                  <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="Maharani Tara"/>
                </div>
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Street Address</label>
                <input type="text" required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="House/Flat No, Street Name"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">City</label>
                  <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="Kolkata"/>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">State</label>
                  <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="West Bengal"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">PIN Code</label>
                  <input type="text" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="700001"/>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Phone Number</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="+91 xxxxx xxxxx"/>
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full mt-4 py-4 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-widest rounded-xl hover:bg-[var(--forest-deep)] transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}