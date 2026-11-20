'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import {
  ShoppingBag,
  Truck,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Search,
  Printer,
  Package,
  MapPin,
  CreditCard,
  Send,
  Sparkles,
  RefreshCw,
  X,
  ShieldCheck,
  ChevronRight,
  User
} from 'lucide-react';

const ORDER_STATUSES = [
  { id: 'all', label: 'All Orders', color: 'bg-[#b07f24]/20 text-[#b07f24] border-[#b07f24]/40' },
  { id: 'pending', label: 'Pending Dispatch', color: 'bg-amber-950/60 text-amber-400 border-amber-500/40' },
  { id: 'processing', label: 'In Preparation', color: 'bg-blue-950/60 text-blue-400 border-blue-500/40' },
  { id: 'shipped', label: 'Shipped / In Transit', color: 'bg-purple-950/60 text-purple-400 border-purple-500/40' },
  { id: 'delivered', label: 'Delivered', color: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-red-950/60 text-red-400 border-red-500/40' }
];

const COURIER_PARTNERS = [
  { id: 'shiprocket', name: 'Shiprocket Direct', trackingUrlPrefix: 'https://shiprocket.co/tracking/' },
  { id: 'delhivery', name: 'Delhivery Express', trackingUrlPrefix: 'https://www.delhivery.com/track/package/' },
  { id: 'bluedart', name: 'BlueDart Air', trackingUrlPrefix: 'https://www.bluedart.com/tracking?awb=' },
  { id: 'dtdc', name: 'DTDC Courier', trackingUrlPrefix: 'https://www.dtdc.in/tracking/shipment-tracking.asp?strCNno=' },
  { id: 'indiapost', name: 'India Post Speed Post', trackingUrlPrefix: 'https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx' }
];

function OrderLogisticsContent() {
  const { user, userDoc } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Tracking Form State
  const [courierData, setCourierData] = useState({
    courier: COURIER_PARTNERS[0].id,
    awbNumber: ''
  });

  // Fetch Orders from Firestore
  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (!db) return;

      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      setOrders(list);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        handledByStaffId: userDoc?.employeeId || 'NWO-STAFF',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update status.');
      fetchOrders();
    }
  };

  // Inject Tracking Info
  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!trackingModalOrder || !courierData.awbNumber) return;

    try {
      setUpdating(true);
      const selectedPartner = COURIER_PARTNERS.find((c) => c.id === courierData.courier);
      const generatedTrackingUrl = `${selectedPartner.trackingUrlPrefix}${courierData.awbNumber.trim()}`;

      const trackingPayload = {
        courier: selectedPartner.name,
        awbNumber: courierData.awbNumber.trim(),
        trackingUrl: generatedTrackingUrl,
        dispatchedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'orders', trackingModalOrder.id), {
        trackingInfo: trackingPayload,
        status: 'shipped',
        handledByStaffId: userDoc?.employeeId || 'NWO-STAFF',
        updatedAt: serverTimestamp()
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === trackingModalOrder.id
            ? { ...o, trackingInfo: trackingPayload, status: 'shipped' }
            : o
        )
      );

      setTrackingModalOrder(null);
      setCourierData({ courier: COURIER_PARTNERS[0].id, awbNumber: '' });
    } catch (err) {
      console.error('Error injecting tracking info:', err);
      alert('Failed to update tracking information.');
    } finally {
      setUpdating(false);
    }
  };

  // Trigger Browser Printable Window for Luxury Invoice
  const handlePrintInvoice = () => {
    window.print();
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = activeTab === 'all' || o.status === activeTab;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o.id?.toLowerCase().includes(term) ||
      o.customerName?.toLowerCase().includes(term) ||
      o.customerEmail?.toLowerCase().includes(term) ||
      o.shippingAddress?.phone?.includes(term) ||
      o.trackingInfo?.awbNumber?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f4d2c]/30 border border-[#b07f24]/30 backdrop-blur-md shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b07f24]/20 border border-[#b07f24]/40 text-[#b07f24] text-[10px] uppercase font-bold tracking-widest mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#fdfcf8] font-light">
            Order Dispatch & Courier Control
          </h1>
          <p className="text-xs text-[#fdfcf8]/70 mt-1 font-sans">
            Inject courier AWB tracking numbers, generate luxury tax invoices, and manage dispatch lifecycles.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 rounded-xl bg-[#06120e] hover:bg-[#0f4d2c] text-[#b07f24] border border-[#b07f24]/40 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Pipeline</span>
        </button>
      </div>

      {/* Pipeline Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ORDER_STATUSES.map((tab) => {
            const count = tab.id === 'all' 
              ? orders.length 
              : orders.filter((o) => o.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#b07f24] text-[#0a1813] border-[#b07f24] shadow-md'
                    : 'bg-[#06120e] text-[#fdfcf8]/70 border-[#b07f24]/20 hover:border-[#b07f24]/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === tab.id ? 'bg-[#0a1813] text-[#b07f24]' : 'bg-[#0f4d2c] text-[#fdfcf8]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#b07f24] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Customer Name, Phone or AWB..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06120e] border border-[#b07f24]/30 text-xs text-[#fdfcf8] placeholder-[#fdfcf8]/40 focus:outline-none focus:border-[#b07f24]"
          />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#06120e] border border-[#b07f24]/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#fdfcf8]">
            <thead className="bg-[#0f4d2c]/40 border-b border-[#b07f24]/20 text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold">
              <tr>
                <th className="p-4 sm:p-5">Order ID & Date</th>
                <th className="p-4 sm:p-5">Customer Details</th>
                <th className="p-4 sm:p-5">Items & Amount</th>
                <th className="p-4 sm:p-5">Pipeline Status</th>
                <th className="p-4 sm:p-5">Courier AWB</th>
                <th className="p-4 sm:p-5 text-right">Invoice & Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b07f24]/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#fdfcf8]/60">
                    <RefreshCw className="w-6 h-6 text-[#b07f24] animate-spin mx-auto mb-2" />
                    <span>Syncing order dispatch records...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#fdfcf8]/60">
                    No orders found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusObj = ORDER_STATUSES.find((s) => s.id === order.status) || ORDER_STATUSES[1];

                  return (
                    <tr key={order.id} className="hover:bg-[#0f4d2c]/20 transition-colors">
                      
                      {/* Order ID & Date */}
                      <td className="p-4 sm:p-5">
                        <div className="font-mono font-bold text-[#b07f24]">
                          #{order.id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-[10px] text-[#fdfcf8]/60 mt-0.5">
                          {order.createdAt?.seconds 
                            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'Recently Placed'}
                        </div>
                      </td>

                      {/* Customer Name & Address */}
                      <td className="p-4 sm:p-5">
                        <div className="font-semibold text-[#fdfcf8]">
                          {order.customerName || order.shippingAddress?.fullName || 'Valued Customer'}
                        </div>
                        <div className="text-[10px] text-[#fdfcf8]/60 truncate max-w-xs mt-0.5">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </div>
                        <div className="text-[10px] font-mono text-[#b07f24] mt-0.5">
                          Ph: {order.shippingAddress?.phone || 'N/A'}
                        </div>
                      </td>

                      {/* Items & Amount */}
                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-[#fdfcf8] font-mono">
                          ₹{order.totalAmount?.toLocaleString('en-IN') || order.subtotal || 0}
                        </div>
                        <div className="text-[10px] text-[#fdfcf8]/70 mt-0.5">
                          {order.items?.length || 1} Botanical Formulation(s)
                        </div>
                        <div className="text-[9px] uppercase font-bold text-emerald-400 mt-0.5">
                          {order.paymentMethod || 'PREPAID'}
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="p-4 sm:p-5">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border bg-[#0a1813] cursor-pointer focus:outline-none ${statusObj.color}`}
                        >
                          <option value="pending" className="bg-[#0a1813] text-amber-400">Pending</option>
                          <option value="processing" className="bg-[#0a1813] text-blue-400">Processing</option>
                          <option value="shipped" className="bg-[#0a1813] text-purple-400">Shipped</option>
                          <option value="delivered" className="bg-[#0a1813] text-emerald-400">Delivered</option>
                          <option value="cancelled" className="bg-[#0a1813] text-red-400">Cancelled</option>
                        </select>
                      </td>

                      {/* Courier & AWB */}
                      <td className="p-4 sm:p-5 font-mono">
                        {order.trackingInfo?.awbNumber ? (
                          <div>
                            <div className="text-xs text-[#fdfcf8] font-semibold">
                              {order.trackingInfo.courier}
                            </div>
                            <a
                              href={order.trackingInfo.trackingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#b07f24] hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <span>{order.trackingInfo.awbNumber}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setTrackingModalOrder(order);
                              setCourierData({ courier: COURIER_PARTNERS[0].id, awbNumber: '' });
                            }}
                            className="px-3 py-1 rounded-lg bg-[#b07f24]/10 hover:bg-[#b07f24]/20 border border-[#b07f24]/40 text-[#b07f24] text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Inject AWB</span>
                          </button>
                        )}
                      </td>

                      {/* Tax Invoice CTA */}
                      <td className="p-4 sm:p-5 text-right space-x-2">
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0f4d2c]/60 hover:bg-[#0f4d2c] text-[#fdfcf8] border border-[#b07f24]/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
                          title="Generate Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#b07f24]" />
                          <span>Tax Invoice</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COURIER AWB INJECTOR MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#06120e] border border-[#b07f24] rounded-3xl p-6 text-[#fdfcf8] shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#b07f24]/20 pb-4">
              <div className="flex items-center gap-2 text-[#b07f24]">
                <Truck className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#fdfcf8]">
                  Inject Tracking & Dispatch
                </h3>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="p-1 rounded-lg bg-[#0f4d2c] text-[#fdfcf8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                  Select Courier Partner *
                </label>
                <select
                  value={courierData.courier}
                  onChange={(e) => setCourierData({ ...courierData, courier: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                >
                  {COURIER_PARTNERS.map((cp) => (
                    <option key={cp.id} value={cp.id}>
                      {cp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                  AWB / Consignment Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={courierData.awbNumber}
                  onChange={(e) => setCourierData({ ...courierData, awbNumber: e.target.value })}
                  placeholder="e.g. 141920831920"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24] font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#b07f24]/20">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-[#b07f24]/30 text-xs text-[#fdfcf8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 rounded-xl bg-[#b07f24] hover:bg-[#c9942b] text-[#0a1813] font-bold text-xs uppercase tracking-wider transition-all"
                >
                  {updating ? 'Saving...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* PRINTABLE TAX INVOICE MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-[#14251b] rounded-3xl p-8 sm:p-12 shadow-2xl my-8 print:p-0 print:shadow-none print:w-full">
            
            {/* Close & Print Action Buttons (Hidden when printing) */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200 print:hidden">
              <div className="flex items-center gap-2 text-[#0f4d2c]">
                <FileText className="w-5 h-5 text-[#b07f24]" />
                <span className="font-serif font-bold text-lg">Tax Invoice & Shipping Label</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintInvoice}
                  className="px-5 py-2 rounded-xl bg-[#0f4d2c] text-[#fdfcf8] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4 text-[#b07f24]" />
                  <span>Print Invoice</span>
                </button>

                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* TAX INVOICE CONTENT */}
            <div id="printable-invoice" className="space-y-8 font-sans">
              
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-gray-300 pb-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#0f4d2c]">NUTRIWELL ORGANICS</h1>
                  <p className="text-xs text-gray-600 mt-1">Ancient Healing with Modern Wellness</p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    GSTIN: <span className="font-mono font-semibold text-gray-800">19AAACN1234F1Z5</span> (West Bengal, India)
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-[#f6f2e7] border border-[#b07f24]/40 text-[#0f4d2c] text-xs font-bold uppercase tracking-widest rounded mb-2">
                    OFFICIAL TAX INVOICE
                  </span>
                  <div className="text-xs font-mono text-gray-800">
                    Invoice No: <span className="font-bold">NWO-INV-{invoiceOrder.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Date: {new Date().toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="font-bold text-[#0f4d2c] uppercase tracking-wider text-[10px] block mb-2">
                    Billed & Shipped To:
                  </span>
                  <div className="font-bold text-sm text-gray-900">
                    {invoiceOrder.customerName || invoiceOrder.shippingAddress?.fullName}
                  </div>
                  <div className="text-gray-600 mt-1 leading-relaxed">
                    {invoiceOrder.shippingAddress?.street || 'Address Line 1'},<br />
                    {invoiceOrder.shippingAddress?.city}, {invoiceOrder.shippingAddress?.state} - {invoiceOrder.shippingAddress?.pincode}
                  </div>
                  <div className="font-mono text-gray-800 mt-2">
                    Phone: {invoiceOrder.shippingAddress?.phone}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="font-bold text-[#0f4d2c] uppercase tracking-wider text-[10px] block mb-2">
                    Apothecary Dispatch Origin:
                  </span>
                  <div className="font-bold text-gray-900">Nutriwell Organics Central Fulfillment</div>
                  <div className="text-gray-600 mt-1 leading-relaxed">
                    Apothecary Estate, Sector V, Salt Lake,<br />
                    Kolkata, West Bengal - 700091, India
                  </div>
                  <div className="font-mono text-gray-800 mt-2">
                    Support: care@nutriwellorganics.com
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-300 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f4d2c] text-[#fdfcf8] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3">
                          <div className="font-bold text-gray-900">{item.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono">HSN Code: 30049011</div>
                        </td>
                        <td className="p-3 text-center font-mono font-bold">{item.quantity || 1}</td>
                        <td className="p-3 text-right font-mono">₹{item.price}</td>
                        <td className="p-3 text-right font-mono font-bold">₹{item.price * (item.quantity || 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-2 border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{invoiceOrder.subtotal || invoiceOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (Included @ 12%):</span>
                    <span className="font-mono">₹{Math.round((invoiceOrder.totalAmount || 0) * 0.12)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charges:</span>
                    <span className="text-emerald-700 font-semibold uppercase">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#0f4d2c] border-t border-gray-300 pt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{invoiceOrder.totalAmount || invoiceOrder.subtotal}</span>
                  </div>
                </div>
              </div>

              {/* Footer Declaration */}
              <div className="border-t border-gray-300 pt-4 text-[10px] text-gray-500 text-center leading-relaxed">
                This is a computer-generated tax invoice and requires no physical signature under Indian IT Act 2000.<br />
                All botanical formulations are packaged in 100% UV Amber Glass. Unboxing video mandatory for returns within 48h.
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function OrderLogisticsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'subadmin', 'sales', 'logistics']}>
      <OrderLogisticsContent />
    </ProtectedRoute>
  );
}