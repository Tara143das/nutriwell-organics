'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useCart } from '@/lib/cartContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart()

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    gstin: '',
    notes: ''
  })

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponErr, setCouponErr] = useState('')

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('upi') // upi, cod, card
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  // Calculations
  const shippingThreshold = 999
  const baseShippingFee = 99
  const shippingFee = cartTotal >= shippingThreshold || cart.length === 0 ? 0 : baseShippingFee

  let discountAmount = 0
  if (appliedCoupon) {
    discountAmount = Math.round((cartTotal * appliedCoupon.percentage) / 100)
  }

  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingFee)

  // Pincode lookup simulator
  useEffect(() => {
    if (formData.pincode.length === 6 && !isNaN(formData.pincode)) {
      const pin = formData.pincode
      if (pin.startsWith('700') || pin.startsWith('711')) {
        setFormData(prev => ({ ...prev, city: 'Kolkata', state: 'West Bengal' }))
      } else if (pin.startsWith('110')) {
        setFormData(prev => ({ ...prev, city: 'New Delhi', state: 'Delhi' }))
      } else if (pin.startsWith('400')) {
        setFormData(prev => ({ ...prev, city: 'Mumbai', state: 'Maharashtra' }))
      } else if (pin.startsWith('560')) {
        setFormData(prev => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }))
      } else {
        setFormData(prev => ({ ...prev, city: 'Metropolitan City', state: 'State Region' }))
      }
    }
  }, [formData.pincode])

  const handleCouponApply = (e) => {
    e.preventDefault()
    setCouponErr('')
    const code = couponCode.trim().toUpperCase()

    if (code === 'ROYAL20') {
      setAppliedCoupon({ code: 'ROYAL20', percentage: 20 })
      setCouponCode('')
    } else if (code === 'HARVEST10') {
      setAppliedCoupon({ code: 'HARVEST10', percentage: 10 })
      setCouponCode('')
    } else {
      setCouponErr('Invalid promo coupon. Try "ROYAL20" for 20% off.')
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return

    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please fill out all required shipping fields.')
      return
    }

    setIsPlacingOrder(true)
    try {
      const orderNumber = `NWO-${Math.floor(100000 + Math.random() * 900000)}`
      
      const orderData = {
        orderNumber,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          gstin: formData.gstin || null
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.images?.[0] || '/images/Sacred Botanicals.png'
        })),
        subtotal: cartTotal,
        discount: discountAmount,
        couponUsed: appliedCoupon?.code || null,
        shippingFee,
        totalAmount: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'pending',
        awbNumber: '',
        courierPartner: '',
        notes: formData.notes,
        createdAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData)

      setOrderSuccess({
        orderId: docRef.id,
        orderNumber,
        totalAmount: finalTotal,
        itemsCount: cart.length
      })

      clearCart()
    } catch (err) {
      console.error('Order Placement Error:', err)
      alert('Failed to place order. Please check your internet connection.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  /* ── ORDER SUCCESS RECEIPT STATE ── */
  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-[var(--paper)] pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto bg-[var(--cream)] border border-[var(--gold)]/30 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 bg-[var(--forest)] text-white rounded-full flex items-center justify-center mx-auto shadow-lg text-3xl">
            ✓
          </div>

          <div className="space-y-2">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-bold">
              Order Confirmed & Placed
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-[var(--ink)] italic">
              Thank You for Choosing Nutriwell
            </h1>
            <p className="font-sans text-xs text-[var(--muted)]">
              Order Reference Number: <strong className="text-[var(--forest)] font-mono">{orderSuccess.orderNumber}</strong>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[var(--line)] space-y-3 text-left">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-[var(--muted)]">Items Count:</span>
              <span className="font-bold text-[var(--ink)]">{orderSuccess.itemsCount} Remedies</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-[var(--muted)]">Total Paid:</span>
              <span className="font-bold text-[var(--forest)]">₹{orderSuccess.totalAmount}</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-[var(--muted)]">Estimated Delivery:</span>
              <span className="font-semibold text-emerald-700">3-5 Business Days</span>
            </div>
          </div>

          <p className="font-sans text-xs text-[var(--muted)] leading-relaxed italic">
            A confirmation receipt and courier tracking details will be dispatched to your phone via SMS.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[var(--forest-deep)] transition-colors"
            >
              Continue Exploring Shop
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 font-sans text-[11px] text-[var(--muted)] tracking-wide mb-2">
            <Link href="/" className="hover:text-[var(--forest)]">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[var(--forest)]">Shop</Link>
            <span>/</span>
            <span className="text-[var(--ink)] font-semibold">Express Checkout</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--ink)] italic">
            Sacred Remedy <span className="text-[var(--gold)]">Checkout</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[var(--cream)] rounded-3xl p-12 text-center space-y-5 border border-[var(--line)]">
            <p className="font-display text-2xl text-[var(--ink)] italic">Your Sacred Cart is Empty</p>
            <p className="font-sans text-xs text-[var(--muted)]">Add remedies to your cart to proceed with checkout.</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[var(--forest-deep)] transition-colors"
            >
              Return to Apothecary
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT 7 COLS: SHIPPING & PAYMENT FORM */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
              
              {/* Shipping Address Box */}
              <div className="p-6 md:p-8 rounded-3xl bg-[var(--cream)]/60 border border-[var(--line)] space-y-5">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <h2 className="font-display text-xl text-[var(--ink)] italic flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--forest)] text-white text-xs font-sans flex items-center justify-center not-italic font-bold">1</span>
                    Shipping Destination
                  </h2>
                  <span className="font-sans text-[10px] text-[var(--gold)] uppercase tracking-widest font-bold">India Delivery Only</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Sen"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Mobile Number (For SMS Tracking) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="vikram@domain.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Street Address / House No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat 4B, Emerald Court, Park Street"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="700016"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">City</label>
                    <input
                      type="text"
                      readOnly
                      placeholder="Auto Lookup"
                      value={formData.city}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--cream)] border border-[var(--line)] text-xs text-[var(--muted)] font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-sans text-xs font-semibold text-[var(--ink)] mb-1">GSTIN (Optional for Tax Invoice)</label>
                    <input
                      type="text"
                      placeholder="19AAACN1234F1Z5"
                      value={formData.gstin}
                      onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--line)] text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection Box */}
              <div className="p-6 md:p-8 rounded-3xl bg-[var(--cream)]/60 border border-[var(--line)] space-y-5">
                <div className="border-b border-[var(--line)] pb-4">
                  <h2 className="font-display text-xl text-[var(--ink)] italic flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--forest)] text-white text-xs font-sans flex items-center justify-center not-italic font-bold">2</span>
                    Select Payment Gateway
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* UPI */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'bg-white border-[var(--forest)] ring-2 ring-[var(--forest)]/20' : 'bg-white/50 border-[var(--line)]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-[var(--forest)]"
                      />
                      <div>
                        <p className="font-sans text-xs font-bold text-[var(--ink)]">Instant UPI / QR Code</p>
                        <p className="font-sans text-[10px] text-[var(--muted)]">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-sans font-bold px-2.5 py-1 rounded-full">Zero Fee</span>
                  </label>

                  {/* COD */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'bg-white border-[var(--forest)] ring-2 ring-[var(--forest)]/20' : 'bg-white/50 border-[var(--line)]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[var(--forest)]"
                      />
                      <div>
                        <p className="font-sans text-xs font-bold text-[var(--ink)]">Cash on Delivery (COD)</p>
                        <p className="font-sans text-[10px] text-[var(--muted)]">Pay cash or scan QR when doorstep delivered</p>
                      </div>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-900 font-sans font-bold px-2.5 py-1 rounded-full">Available</span>
                  </label>

                  {/* Cards */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'bg-white border-[var(--forest)] ring-2 ring-[var(--forest)]/20' : 'bg-white/50 border-[var(--line)]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[var(--forest)]"
                      />
                      <div>
                        <p className="font-sans text-xs font-bold text-[var(--ink)]">Credit / Debit Cards & NetBanking</p>
                        <p className="font-sans text-[10px] text-[var(--muted)]">Visa, Mastercard, RuPay, HDFC, ICICI</p>
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full py-4 bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all shadow-xl disabled:opacity-50"
                >
                  {isPlacingOrder ? 'Processing Order...' : `Confirm & Place Order (₹${finalTotal})`}
                </button>
              </div>

            </form>

            {/* RIGHT 5 COLS: ORDER SUMMARY */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="p-6 md:p-8 rounded-3xl bg-[var(--cream)] border border-[var(--gold)]/30 space-y-6 shadow-sm">
                <h3 className="font-display text-xl text-[var(--ink)] italic border-b border-[var(--line)] pb-3">
                  Sacred Order Summary
                </h3>

                {/* Items list */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[var(--line)]">
                      <img
                        src={item.image || item.images?.[0] || '/images/Sacred Botanicals.png'}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-xl bg-[var(--cream)]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm text-[var(--ink)] truncate">{item.name}</h4>
                        <p className="font-sans text-[11px] text-[var(--muted)]">Qty: {item.quantity}</p>
                        <p className="font-sans text-xs font-bold text-[var(--forest)]">₹{item.price * item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-[var(--muted)] hover:text-red-500 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <form onSubmit={handleCouponApply} className="space-y-2 pt-2 border-t border-[var(--line)]">
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">
                    Have a Harvest Promo Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ROYAL20"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-[var(--line)] text-xs uppercase font-mono text-[var(--ink)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase rounded-xl hover:bg-[var(--forest-deep)] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponErr && <p className="font-sans text-[11px] text-red-500">{couponErr}</p>}
                  {appliedCoupon && (
                    <p className="font-sans text-[11px] text-emerald-700 font-bold flex items-center justify-between">
                      <span>✓ Code {appliedCoupon.code} Applied ({appliedCoupon.percentage}% Off)</span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-red-500 underline ml-2">Remove</button>
                    </p>
                  )}
                </form>

                {/* Bill Breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-[var(--line)] font-sans text-xs">
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[var(--ink)]">₹{cartTotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Royal Express Shipping</span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">FREE</span>
                    ) : (
                      <span className="font-semibold text-[var(--ink)]">₹{shippingFee}</span>
                    )}
                  </div>

                  {shippingFee > 0 && (
                    <p className="text-[10px] text-[var(--gold)] italic">
                      Add ₹{shippingThreshold - cartTotal} more remedies for Free Royal Delivery!
                    </p>
                  )}

                  <div className="flex justify-between font-display text-xl text-[var(--ink)] font-bold pt-3 border-t border-[var(--line)]">
                    <span>Grand Total</span>
                    <span className="text-[var(--forest)]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="p-3 rounded-xl bg-white/60 border border-[var(--line)] text-center font-sans text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  🔒 256-Bit Encrypted Ayurvedic Checkout
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  )
}