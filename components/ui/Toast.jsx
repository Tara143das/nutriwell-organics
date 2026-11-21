'use client'

import { useToast } from '@/lib/toastContext'

export default function Toast() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-24 right-4 md:right-8 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center justify-between gap-3 transition-all duration-300 animate-slide-in ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-100'
              : toast.type === 'info'
              ? 'bg-[var(--dark-bg)]/90 border-[var(--gold)]/40 text-[var(--paper)]'
              : 'bg-[#0a2316]/95 border-emerald-500/40 text-emerald-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '🌿'}
            </span>
            <p className="font-sans text-xs font-semibold leading-snug">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity px-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}