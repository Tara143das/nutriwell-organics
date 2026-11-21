import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
      <div className="w-24 h-24 rounded-full bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center mb-8 shadow-inner">
        <span className="font-display text-4xl text-[var(--gold)] italic">404</span>
      </div>

      <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[var(--gold)] font-bold mb-3">
        Uncharted Path
      </span>

      <h1 className="font-display text-4xl md:text-5xl text-[var(--ink)] italic max-w-lg mb-4 leading-tight">
        Sacred Remedy Path Not Found
      </h1>

      <p className="font-sans text-xs md:text-sm text-[var(--muted)] max-w-md mb-8 leading-relaxed">
        The formulation or page you are seeking has either evolved, been renamed, or returned to nature.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-[var(--forest)] text-white font-sans text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[var(--forest-deep)] transition-all shadow-lg"
        >
          Explore Apothecary Shop
        </Link>
        <Link
          href="/"
          className="px-8 py-3.5 border border-[var(--line)] text-[var(--ink)] font-sans text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:border-[var(--ink)] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  )
}