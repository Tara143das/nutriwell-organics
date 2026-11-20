'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore'

export default function CustomerAccountPage() {
  const { user, userProfile, logout } = useAuth()

  // State
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)

  const [formData, setFormData] = useState({
    title: 'Home',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  })

  // Load User Data (Addresses & Orders)
  useEffect(() => {
    if (!user?.uid) return

    // 1. Fetch Saved Addresses from users/{uid}
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists() && userSnap.data().addresses) {
          setAddresses(userSnap.data().addresses)
        }
      } catch (err) {
        console.error('Error loading address book:', err)
      }
    }

    // 2. Fetch Orders from orders collection
    const fetchOrders = async () => {
      setLoadingOrders(true)
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerEmail', '==', user.email),
          orderBy('createdAt', 'desc')
        )
        const snap = await getDocs(q)
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error('Error fetching customer orders:', err)
        // Fallback query if compound index is pending
        try {
          const snap = await getDocs(collection(db, 'orders'))
          const filtered = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((o) => o.customerEmail === user.email)
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          setOrders(filtered)
        } catch (fallbackErr) {
          console.error('Fallback query error:', fallbackErr)
        }
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchUserData()
    fetchOrders()
  }, [user])

  // Save New Address
  const handleSaveAddress = async (e) => {
    e.preventDefault()
    if (!user?.uid) return
    setSavingAddress(true)

    try {
      const newAddress = { ...formData, id: Date.now().toString() }
      const userRef = doc(db, 'users', user.uid)

      await updateDoc(userRef, {
        addresses: arrayUnion(newAddress)
      })

      setAddresses((prev) => [...prev, newAddress])
      setShowAddressForm(false)
      setFormData({
        title: 'Home',
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
      })
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Failed to save address. Please check your connection.')
    } finally {
      setSavingAddress(false)
    }
  }

  // Delete Address
  const handleDeleteAddress = async (addressToRemove) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        addresses: arrayRemove(addressToRemove)
      })
      setAddresses((prev) => prev.filter((a) => a.id !== addressToRemove.id))
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  const displayName =
    userProfile?.fullName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Wellness Seeker'

  return (
    <ProtectedRoute allowedRoles={['customer', 'admin', 'subadmin', 'sales', 'logistics', 'employee', 'super_admin']}>
      <div className="min-h-screen pt-28 pb-24 px-4 md:px-8 bg-[var(--paper)]">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* HEADER BANNER */}
          <div className="bg-[var(--cream)]/60 rounded-[2.5rem] p-8 md:p-12 border border-[var(--gold)]/30 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] font-bold">
                Customer Sanctuary
              </span>
              <h1 className="font-display text-3xl md:text-5xl text-[var(--ink)] mt-2 tracking-tight">
                Welcome,{' '}
                <span className="text-[var(--gold)] font-bold italic tracking-wide [text-shadow:0_0_12px_rgba(176,127,36,0.5)]">
                  {displayName.split(' ')[0]}
                </span>
              </h1>
              <p className="font-sans text-xs text-[var(--muted)] mt-2 tracking-wide max-w-md">
                Manage your holistic wellness journey, track sacred formulation dispatches, and maintain address records.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--forest-deep)] transition-all text-center shadow-md"
              >
                New Purchase
              </Link>
              <button
                onClick={logout}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[var(--line)] text-[var(--ink)] font-sans text-xs font-bold uppercase tracking-[0.2em] hover:border-[var(--ink)] transition-colors text-center"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT 2 COLS: PURCHASE RECORDS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-end justify-between border-b border-[var(--line)] pb-4">
                <h2 className="font-display text-2xl text-[var(--ink)] italic">
                  Purchase <span className="text-[var(--gold)]">Records</span>
                </h2>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  {orders.length} Orders Total
                </span>
              </div>

              {loadingOrders ? (
                <div className="space-y-4">
                  <div className="h-44 bg-[var(--cream)] rounded-3xl animate-pulse" />
                  <div className="h-44 bg-[var(--cream)] rounded-3xl animate-pulse" />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white/60 rounded-3xl border border-[var(--line)] p-12 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[var(--cream)] flex items-center justify-center border border-[var(--gold)]/20">
                    <svg className="w-7 h-7 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl text-[var(--ink)] italic">No Past Purchases</h3>
                  <p className="font-sans text-xs text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
                    You haven't placed any orders yet. Discover our ancient Ayurvedic formulations to begin your journey.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-8 py-3 rounded-full border border-[var(--gold)]/50 text-[var(--forest)] font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--gold)]/10 transition-colors"
                  >
                    Explore Apothecary Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-3xl bg-white border border-[var(--line)] p-6 md:p-8 space-y-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Top bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
                        <div>
                          <span className="font-mono text-xs text-[var(--gold)] font-bold">
                            Order #{order.orderNumber || order.id.slice(0, 8)}
                          </span>
                          <p className="font-sans text-[11px] text-[var(--muted)]">
                            Placed on: {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider ${
                            order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-900'
                          }`}>
                            {order.orderStatus || 'Processing'}
                          </span>
                          <span className="font-display text-xl font-bold text-[var(--forest)]">
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Courier Tracking Ribbon */}
                      {order.awbNumber && (
                        <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">🚚</span>
                            <div>
                              <p className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-300">
                                Courier Partner: {order.courierPartner || 'Express Air'}
                              </p>
                              <p className="font-mono text-xs text-emerald-100/80">
                                AWB Tracking #: {order.awbNumber}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-emerald-800 text-emerald-100 font-sans text-[10px] uppercase font-semibold rounded-full">
                            In Transit
                          </span>
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-[var(--cream)]/40 p-3 rounded-2xl border border-[var(--line)]">
                            <img
                              src={item.image || '/images/Sacred Botanicals.png'}
                              alt={item.name}
                              className="w-14 h-16 object-cover rounded-xl bg-white border border-[var(--line)]"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-display text-sm text-[var(--ink)] font-semibold truncate">{item.name}</h4>
                              <p className="font-sans text-xs text-[var(--muted)]">Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                            <span className="font-sans text-xs font-bold text-[var(--forest)]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Destination Footer */}
                      {order.shippingAddress && (
                        <div className="pt-2 text-xs font-sans text-[var(--muted)] flex flex-wrap justify-between items-center border-t border-[var(--line)]">
                          <p>
                            <strong>Deliver To:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} ({order.shippingAddress.pincode})
                          </p>
                          <span className="uppercase font-bold text-[var(--gold)] text-[10px]">
                            Payment: {order.paymentMethod?.toUpperCase() || 'ONLINE'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT 1 COL: PROFILE & SAVED ADDRESSES */}
            <div className="space-y-8">
              
              {/* Profile Card */}
              <div>
                <h2 className="font-display text-2xl text-[var(--ink)] italic border-b border-[var(--line)] pb-4 mb-6">
                  Profile Details
                </h2>
                <div className="bg-[var(--cream)]/50 rounded-3xl border border-[var(--line)] p-6 space-y-4">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1 font-bold">Email Address</p>
                    <p className="font-sans text-xs font-semibold text-[var(--ink)] truncate">{user?.email}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1 font-bold">Account Privilege</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="font-sans text-xs text-[var(--ink)] font-semibold uppercase tracking-wider">
                        {userProfile?.role || 'Verified Customer'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Book */}
              <div>
                <div className="flex items-end justify-between border-b border-[var(--line)] pb-4 mb-6">
                  <h2 className="font-display text-2xl text-[var(--ink)] italic">
                    Saved <span className="text-[var(--gold)]">Addresses</span>
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="font-sans text-[11px] uppercase tracking-widest text-[var(--forest)] hover:text-[var(--gold)] font-bold transition-colors"
                  >
                    + Add New
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="bg-white/60 rounded-3xl border border-[var(--line)] p-6 text-center">
                      <p className="font-sans text-xs text-[var(--muted)] italic py-2">
                        No addresses saved yet. Add one for faster express checkout.
                      </p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="bg-white rounded-2xl border border-[var(--line)] p-5 relative group hover:border-[var(--gold)] transition-colors shadow-sm"
                      >
                        <span className="absolute top-4 right-5 font-sans text-[9px] uppercase tracking-widest text-[var(--gold)] bg-[var(--cream)] px-2.5 py-1 rounded-full font-bold border border-[var(--gold)]/20">
                          {addr.title}
                        </span>
                        <p className="font-display text-sm text-[var(--ink)] font-bold mb-1 pr-14">{addr.fullName}</p>
                        <p className="font-sans text-xs text-[var(--muted)] leading-relaxed">
                          {addr.street},<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="font-sans text-xs text-[var(--muted)] mt-2 font-medium">Phone: {addr.phone}</p>

                        <button
                          onClick={() => handleDeleteAddress(addr)}
                          className="mt-3 font-sans text-[10px] text-red-500 hover:text-red-700 uppercase tracking-widest font-bold"
                        >
                          Delete Address
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Add Address Modal */}
        {showAddressForm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[var(--paper)] max-w-lg w-full rounded-[2.5rem] p-8 shadow-2xl relative border border-[var(--gold)]/30 space-y-6">
              <button
                onClick={() => setShowAddressForm(false)}
                className="absolute top-6 right-6 text-[var(--muted)] hover:text-black text-lg"
              >
                ✕
              </button>
              <h3 className="font-display text-2xl text-[var(--ink)] italic">Add New Delivery Address</h3>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">
                      Label As
                    </label>
                    <select
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 bg-[var(--cream)] border border-[var(--line)] rounded-xl text-xs font-sans text-[var(--ink)] focus:outline-none"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs text-[var(--ink)] focus:outline-none"
                      placeholder="e.g. Radhika Sen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">
                    Street Address / House No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs text-[var(--ink)] focus:outline-none"
                    placeholder="Flat 4B, Emerald Court"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs text-[var(--ink)] focus:outline-none"
                      placeholder="Kolkata"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs text-[var(--ink)] focus:outline-none"
                      placeholder="West Bengal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs text-[var(--ink)] focus:outline-none"
                      placeholder="700001"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs text-[var(--ink)] focus:outline-none"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingAddress}
                  className="w-full mt-4 py-3.5 bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[var(--forest-deep)] transition-colors disabled:opacity-50"
                >
                  {savingAddress ? 'Saving Address...' : 'Save Address to Book'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}