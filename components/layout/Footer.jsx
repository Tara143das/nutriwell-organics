import Link from 'next/link'

const LINKS = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Sacred Botanicals', href: '/shop?cat=Sacred+Botanicals' },
    { label: 'Therapeutic Food', href: '/shop?cat=Therapeutic+Food' },
    { label: 'Yogic Balance', href: '/shop?cat=Yogic+Balance' },
    { label: 'Cellular Defense', href: '/shop?cat=Cellular+Defense' },
  ],
  Company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Ingredients', href: '/#ingredients' },
    { label: 'Sustainability', href: '/about' },
    { label: 'Certifications', href: '/about' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Track Order', href: '/track' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[var(--forest-deep)] text-white/80">

      {/* ── Newsletter ── */}
      <div className="border-b border-white/[.07]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-14 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <p className="font-sans text-[10px] uppercase tracking-[.35em] text-[var(--gold-soft)] mb-3">
              Join the Wellness Circle
            </p>
            <h3 className="font-display text-2xl md:text-3xl text-white leading-snug mb-3">
              Ancient wisdom, delivered to your <span className="italic text-[var(--gold-soft)]">inbox</span>
            </h3>
            <p className="font-sans text-sm text-white/40 mb-7 leading-relaxed">
              Exclusive formulations, seasonal rituals, and 10% off your first order.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com"
                className="flex-1 px-5 py-3 bg-white/[.06] border border-white/[.1] rounded-full font-sans text-sm text-white placeholder:text-white/25 placeholder:italic focus:outline-none focus:border-[var(--gold)]/40 focus:bg-white/[.08] transition-all duration-300"/>
              <button type="button"
                className="px-7 py-3 bg-[var(--gold)] text-white font-sans text-[10px] uppercase tracking-[.2em] rounded-full hover:bg-[var(--gold-soft)] hover:text-[var(--ink)] transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Link Columns ── */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-xl text-white">
                Nutri<span className="italic text-[var(--gold-soft)]">well</span>
              </span>
            </Link>
            <p className="font-sans text-[12px] text-white/35 leading-relaxed mb-5">
              Bridging 5,000 years of Ayurvedic wisdom with modern nutritional science.
            </p>
            <div className="flex gap-3">
              {[
                { l: 'Instagram', d: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z' },
                { l: 'Facebook', d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { l: 'YouTube', d: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02l5.75-3.27-5.75-3.27v6.54z' },
              ].map(s => (
                <a key={s.l} href="#" aria-label={s.l}
                  className="w-9 h-9 rounded-full border border-white/[.1] flex items-center justify-center text-white/30 hover:text-[var(--gold-soft)] hover:border-[var(--gold-soft)]/30 transition-all duration-300">
                  <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                    <path d={s.d} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-sans text-[10px] uppercase tracking-[.25em] text-[var(--gold-soft)]/70 mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href}
                      className="font-sans text-[12px] text-white/35 hover:text-white/80 transition-colors duration-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust ── */}
      <div className="border-t border-white/[.06]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {['GMP Certified','100% Organic','Cruelty Free','FSSAI Approved'].map(b => (
              <span key={b} className="font-sans text-[9px] uppercase tracking-[.25em] text-white/20 border border-white/[.08] px-4 py-1.5 rounded-full">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom ── */}
      <div className="border-t border-white/[.06]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-white/20">
            © {new Date().getFullYear()} Nutriwell Organics. All rights reserved.
          </p>
          <p className="font-sans text-[10px] text-white/15 tracking-wider">
            Ancient Healing with Modern Wellness
          </p>
        </div>
      </div>
    </footer>
  )
}