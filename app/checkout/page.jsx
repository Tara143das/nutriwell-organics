'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useCart } from '@/lib/cartContext'
import { useAuth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, subtotal, clearCart } = useCart()
  const { user } = useAuth()

  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)

  // New Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)
  const [formData, setFormData] = useState({
    title: 'Home', fullName: '', phone: '', street: '', city: '', state: '', pincode: ''
  })

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79
  const total = subtotal + shipping

  // Fetch Addresses from Firebase
  useEffect(() => {
    if (user?.uid) {
      const fetchAddresses = async () => {
        try {
          const docRef = doc(db, 'users', user.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists() && docSnap.data().addresses?.length > 0) {
            const fetchedAddresses = docSnap.data().addresses
            setAddresses(fetchedAddresses)
            setSelectedAddress(fetchedAddresses[0]) // Auto-select first address
          }
        } catch (error) {
          console.error("Error fetching addresses:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchAddresses()
    }
  }, [user])

  // Save New Address Inline
  const handleSaveAddress = async (e) => {
    e.preventDefault()
    setSavingAddress(true)
    try {
      const newAddress = { ...formData, id: Date.now().toString() }
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, { addresses: arrayUnion(newAddress) })
      
      setAddresses([...addresses, newAddress])
      setSelectedAddress(newAddress)
      setShowAddressForm(false)
      setFormData({ title: 'Home', fullName: '', phone: '', street: '', city: '', state: '', pincode: '' })
    } catch (error) {
      alert("Failed to save address.")
    } finally {
      setSavingAddress(false)
    }
  }

  // Place Order Logic
  const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert("Please select a delivery address.")
    if (cartItems.length === 0) return alert("Your cart is empty.")

    setPlacingOrder(true)
    try {
      const orderData = {
        userId: user.uid,
        customerEmail: user.email,
        items: cartItems,
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        shippingFee: shipping,
        totalAmount: total,
        status: 'pending',
        createdAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData)
      clearCart() // Empty the cart after successful order
      router.push(`/checkout/success?orderId=${docRef.id}`)
    } catch (error) {
      console.error("Order error:", error)
      alert("Something went wrong while placing your order.")
      setPlacingOrder(false)
    }
  }

  // Redirect if cart is empty (and not loading)
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] pt-32 pb-20 flex flex-col items-center justify-center">
        <h1 className="font-display text-3xl text-[var(--ink)] mb-4">Your Cart is Empty</h1>
        <Link href="/shop" className="px-8 py-3 bg-[var(--forest)] text-white font-sans text-[11px] uppercase tracking-[.2em] rounded-full hover:bg-[var(--forest-deep)] transition-colors">
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['customer', 'admin', 'employee', 'super_admin']}>
      <main className="min-h-screen bg-[var(--paper)] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl text-[var(--ink)]">
              Secure <span className="italic text-[var(--gold)]">Checkout</span>
            </h1>
            <p className="font-sans text-[11px] uppercase tracking-widest text-[var(--muted)] mt-2">
              Complete your holistic order
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* Left Column: Information & Shipping */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* Contact Info */}
              <section className="space-y-4">
                <h2 className="font-display text-xl text-[var(--ink)] border-b border-[var(--line)]/50 pb-3">1. Contact Information</h2>
                <div className="p-4 bg-white/50 border border-[var(--line)]/50 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--forest)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans text-sm text-[var(--ink)] font-medium">{user?.displayName || 'Customer'}</p>
                    <p className="font-sans text-[11px] text-[var(--muted)]">{user?.email}</p>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="space-y-4">
                <div className="flex items-end justify-between border-b border-[var(--line)]/50 pb-3">
                  <h2 className="font-display text-xl text-[var(--ink)]">2. Delivery Address</h2>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="font-sans text-[10px] uppercase tracking-[.2em] text-[var(--forest)] hover:text-[var(--gold)] transition-colors">
                      + Add New
                    </button>
                  )}
                </div>

                {loading ? (
                  <p className="font-sans text-xs text-[var(--muted)] italic">Loading your addresses...</p>
                ) : showAddressForm ? (
                  <form onSubmit={handleSaveAddress} className="bg-[var(--cream)]/20 p-6 rounded-3xl border border-[var(--line)]/50 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                      <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="Full Name"/>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="Phone Number"/>
                    </div>
                    <input type="text" required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="Street Address"/>
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="City"/>
                      <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="State"/>
                      <input type="text" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full p-3 bg-white border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--forest)]" placeholder="PIN"/>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="px-5 py-2 font-sans text-[10px] uppercase tracking-widest text-[var(--muted)]">Cancel</button>
                      <button type="submit" disabled={savingAddress} className="px-6 py-2 bg-[var(--forest)] text-white font-sans text-[10px] uppercase tracking-widest rounded-xl hover:bg-[var(--forest-deep)] transition-colors disabled:opacity-50">
                        {savingAddress ? 'Saving...' : 'Save & Select'}
                      </button>
                    </div>
                  </form>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-6 bg-white/40 border border-[var(--line)]/50 rounded-2xl">
                    <p className="font-sans text-xs text-[var(--muted)] italic mb-3">No saved addresses found.</p>
                    <button onClick={() => setShowAddressForm(true)} className="px-6 py-2.5 bg-[var(--cream)] border border-[var(--gold)]/30 text-[var(--forest)] font-sans text-[10px] uppercase tracking-[.2em] rounded-full hover:bg-[var(--gold)]/10 transition-colors">
                      Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative ${selectedAddress?.id === addr.id ? 'border-[var(--forest)] bg-[var(--forest)]/5 shadow-[0_4px_20px_-10px_rgba(10,53,32,.2)]' : 'border-[var(--line)]/50 bg-white/50 hover:border-[var(--gold)]/40'}`}
                      >
                        {selectedAddress?.id === addr.id && (
                          <div className="absolute top-4 right-4 text-[var(--forest)]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <span className="font-sans text-[8px] uppercase tracking-widest text-[var(--gold)] bg-[var(--cream)] px-2 py-1 rounded inline-block mb-2">
                          {addr.title}
                        </span>
                        <p className="font-display text-sm text-[var(--ink)] mb-1 pr-6">{addr.fullName}</p>
                        <p className="font-sans text-[11px] text-[var(--muted)] leading-relaxed">
                          {addr.street},<br/>{addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Payment Method */}
              <section className="space-y-4">
                <h2 className="font-display text-xl text-[var(--ink)] border-b border-[var(--line)]/50 pb-3">3. Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-[var(--forest)] bg-white' : 'border-[var(--line)]/50 bg-white/40'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="text-[var(--forest)] focus:ring-[var(--forest)] w-4 h-4" />
                    <div>
                      <p className="font-display text-sm text-[var(--ink)]">Secure Online Payment</p>
                      <p className="font-sans text-[10px] text-[var(--muted)]">UPI, Credit/Debit Cards, NetBanking</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[var(--forest)] bg-white' : 'border-[var(--line)]/50 bg-white/40'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-[var(--forest)] focus:ring-[var(--forest)] w-4 h-4" />
                    <div>
                      <p className="font-display text-sm text-[var(--ink)]">Cash on Delivery (COD)</p>
                      <p className="font-sans text-[10px] text-[var(--muted)]">Pay safely at your doorstep</p>
                    </div>
                  </label>
                </div>
              </section>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-white/60 border border-[var(--line)]/50 rounded-[2rem] p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <h3 className="font-display text-2xl text-[var(--ink)] mb-6">Order Summary</h3>
                
                {/* Items */}
                <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 mb-6 scrollbar-thin">
                  {cartItems.map(item => (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-4 items-center">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[var(--cream)] flex-shrink-0 border border-[var(--line)]/40">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--forest)] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                          {item.qty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[13px] text-[var(--ink)] truncate">{item.name}</p>
                        <p className="font-sans text-[9px] text-[var(--muted)] uppercase tracking-wider">{item.variant}</p>
                      </div>
                      <p className="font-sans text-xs font-semibold text-[var(--forest)]">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Calculation */}
                <div className="space-y-3 font-sans text-xs border-t border-[var(--line)]/40 pt-6">
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-[var(--forest)] font-medium' : ''}>
                      {shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--ink)] font-semibold text-lg pt-4 border-t border-[var(--line)]/40 mt-2">
                    <span className="font-display text-xl">Total</span>
                    <span className="font-display text-xl text-[var(--forest)]">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button 
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !selectedAddress}
                  className="w-full mt-8 py-4 bg-[var(--forest)] text-white font-sans text-xs uppercase tracking-[.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all duration-300 shadow-[0_8px_25px_-8px_rgba(15,77,44,.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placingOrder ? 'Processing...' : `Place Order • ₹${total.toLocaleString()}`}
                </button>

                <p className="text-center font-sans text-[9px] text-[var(--muted)] mt-4 flex items-center justify-center gap-1.5">
                  <svg className="w-3 h-3 text-[var(--forest)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  256-Bit Secure SSL Encryption
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}