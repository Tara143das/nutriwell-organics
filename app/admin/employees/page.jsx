'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth'; // Strict compliance
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  where 
} from 'firebase/firestore';
import { 
  UserPlus, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  RefreshCw, 
  Search, 
  Key, 
  Check, 
  X, 
  Sparkles, 
  Lock, 
  Phone, 
  Mail, 
  BadgeCheck,
  Building2,
  AlertTriangle
} from 'lucide-react';

const STAFF_ROLES = [
  { id: 'admin', label: 'Super Admin', prefix: 'NWO-ADM' },
  { id: 'subadmin', label: 'Sub-Admin', prefix: 'NWO-ADM' },
  { id: 'sales', label: 'Sales Executive', prefix: 'NWO-SALES' },
  { id: 'logistics', label: 'Back Office & Logistics', prefix: 'NWO-OPS' }
];

// Helper: Auto Random Employee ID Generator
const generateRandomEmpId = (role) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  if (role === 'admin' || role === 'subadmin') return `NWO-ADM-${rand}`;
  if (role === 'sales') return `NWO-SALES-${rand}`;
  if (role === 'logistics') return `NWO-OPS-${rand}`;
  return `NWO-STAFF-${rand}`;
};

function EmployeeManagementContent() {
  const { user, userDoc } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Add Employee Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'subadmin',
    employeeId: generateRandomEmpId('subadmin')
  });

  // Fetch All Staff Members from Firestore
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      if (!db) return;

      const q = query(
        collection(db, 'users'),
        where('role', 'in', ['admin', 'subadmin', 'sales', 'logistics'])
      );

      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      setEmployees(list);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Regenerate ID when role changes in form
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
      employeeId: generateRandomEmpId(selectedRole)
    }));
  };

  // Regenerate ID manually button
  const handleRegenerateId = () => {
    setFormData((prev) => ({
      ...prev,
      employeeId: generateRandomEmpId(prev.role)
    }));
  };

  // Submit New Staff
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName) return;

    try {
      setSaving(true);
      
      // Document ID keyed by lowercase email or auto id
      const staffDocId = formData.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');

      const staffData = {
        uid: staffDocId,
        displayName: formData.fullName,
        email: formData.email.toLowerCase(),
        phone: formData.phone || '',
        role: formData.role,
        employeeId: formData.employeeId,
        status: 'active',
        createdAt: serverTimestamp(),
        createdByUid: user?.uid || 'super-admin'
      };

      await setDoc(doc(db, 'users', staffDocId), staffData, { merge: true });

      setSuccessMessage(`Staff credential issued: ${formData.employeeId}`);
      setTimeout(() => setSuccessMessage(''), 4000);

      setShowModal(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'subadmin',
        employeeId: generateRandomEmpId('subadmin')
      });

      fetchEmployees();
    } catch (err) {
      console.error('Error adding staff:', err);
      alert('Failed to register employee. Check permissions.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Staff Access Switch (Active / Suspended)
  const handleToggleStatus = async (emp) => {
    const newStatus = emp.status === 'suspended' ? 'active' : 'suspended';
    const confirmMsg = `Are you sure you want to ${newStatus === 'suspended' ? 'SUSPEND' : 'ACTIVATE'} ${emp.displayName} (${emp.employeeId})?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await updateDoc(doc(db, 'users', emp.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      setEmployees((prev) =>
        prev.map((item) => (item.id === emp.id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to update employee status.');
    }
  };

  // Filtered Staff
  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.displayName?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.employeeId?.toLowerCase().includes(term) ||
      emp.role?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f4d2c]/30 border border-[#b07f24]/30 backdrop-blur-md shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b07f24]/20 border border-[#b07f24]/40 text-[#b07f24] text-[10px] uppercase font-bold tracking-widest mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin Authorization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#fdfcf8] font-light">
            Employee & Sub-Admin Portal
          </h1>
          <p className="text-xs text-[#fdfcf8]/70 mt-1 font-sans">
            Manage operational roles, issue random Employee IDs, and control access permissions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-xl bg-[#b07f24] hover:bg-[#c9942b] text-[#0a1813] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(176,127,36,0.3)] flex items-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Issue Staff Credential</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <BadgeCheck className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#b07f24] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search staff by Name, Email, or Employee ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06120e] border border-[#b07f24]/30 text-xs text-[#fdfcf8] placeholder-[#fdfcf8]/40 focus:outline-none focus:border-[#b07f24]"
        />
      </div>

      {/* Employees Table Container */}
      <div className="bg-[#06120e] border border-[#b07f24]/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#fdfcf8]">
            <thead className="bg-[#0f4d2c]/40 border-b border-[#b07f24]/20 text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold">
              <tr>
                <th className="p-4 sm:p-5">Employee ID</th>
                <th className="p-4 sm:p-5">Staff Member</th>
                <th className="p-4 sm:p-5">Assigned Role</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b07f24]/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#fdfcf8]/60">
                    <RefreshCw className="w-6 h-6 text-[#b07f24] animate-spin mx-auto mb-2" />
                    <span>Loading staff directory...</span>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#fdfcf8]/60">
                    No active staff members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const isSuspended = emp.status === 'suspended';
                  const roleObj = STAFF_ROLES.find((r) => r.id === emp.role);

                  return (
                    <tr key={emp.id} className="hover:bg-[#0f4d2c]/20 transition-colors">
                      
                      {/* Employee ID Tag */}
                      <td className="p-4 sm:p-5 font-mono font-bold text-[#b07f24]">
                        {emp.employeeId || 'NWO-UNASSIGNED'}
                      </td>

                      {/* Name & Contact */}
                      <td className="p-4 sm:p-5">
                        <div className="font-semibold text-[#fdfcf8]">{emp.displayName || 'Unnamed Staff'}</div>
                        <div className="text-[11px] text-[#fdfcf8]/60 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-[#b07f24]" />
                          <span>{emp.email}</span>
                        </div>
                        {emp.phone && (
                          <div className="text-[10px] text-[#fdfcf8]/50 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[#b07f24]" />
                            <span>{emp.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Role Pill */}
                      <td className="p-4 sm:p-5">
                        <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#0f4d2c] text-[#fdfcf8] border border-[#b07f24]/40">
                          {roleObj?.label || emp.role}
                        </span>
                      </td>

                      {/* Status Indicator */}
                      <td className="p-4 sm:p-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          isSuspended 
                            ? 'bg-red-950/60 border-red-500/50 text-red-400' 
                            : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}`} />
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 sm:p-5 text-right">
                        <button
                          onClick={() => handleToggleStatus(emp)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                            isSuspended
                              ? 'bg-emerald-900/40 hover:bg-emerald-800/60 border-emerald-500 text-emerald-300'
                              : 'bg-red-950/40 hover:bg-red-900/60 border-red-800 text-red-300'
                          }`}
                        >
                          {isSuspended ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>Suspend Access</span>
                            </>
                          )}
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

      {/* ADD EMPLOYEE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          
          <div className="relative w-full max-w-lg bg-[#06120e] border border-[#b07f24] rounded-3xl p-6 sm:p-8 text-[#fdfcf8] shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#b07f24]/20 pb-4">
              <div className="flex items-center gap-2 text-[#b07f24]">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#fdfcf8]">
                  Issue New Staff Credential
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-[#0f4d2c] text-[#fdfcf8] hover:bg-[#b07f24] hover:text-[#0a1813] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddEmployee} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                  Full Staff Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Vikramaditya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                />
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@nutriwell.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                  Role Permission Level *
                </label>
                <select
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                >
                  {STAFF_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} ({r.prefix}-XXXX)
                    </option>
                  ))}
                </select>
              </div>

              {/* Generated Employee ID Display */}
              <div className="p-4 rounded-xl bg-[#0f4d2c]/40 border border-[#b07f24]/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#fdfcf8]/60 block font-medium">
                    Auto Generated Employee ID
                  </span>
                  <span className="text-base font-mono font-bold text-[#b07f24]">
                    {formData.employeeId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRegenerateId}
                  className="p-2 rounded-lg bg-[#0a1813] border border-[#b07f24]/30 text-[#b07f24] hover:bg-[#b07f24] hover:text-[#0a1813] transition-colors"
                  title="Regenerate Random ID"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#b07f24]/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#b07f24]/30 text-xs text-[#fdfcf8]/70 hover:bg-[#0f4d2c]/20"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#b07f24] hover:bg-[#c9942b] text-[#0a1813] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Authorize Staff Credential</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default function EmployeeManagementPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <EmployeeManagementContent />
    </ProtectedRoute>
  );
}