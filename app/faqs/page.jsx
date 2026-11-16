'use client';

import { useState } from 'react';

const faqs = [
  {
    q: "Are your products safe and 100% natural?",
    a: "Yes, our products are formulated using authentic Ayurvedic ingredients and are free from harmful chemicals. However, since they contain active botanicals, we strongly advise reading the ingredients list and performing a patch test. We are not liable for individual allergic reactions."
  },
  {
    q: "What is your Return & Refund Policy?",
    a: "We maintain a strict quality control process. Returns or replacements are ONLY accepted if the product is delivered damaged or if an incorrect item is received. An unboxing video without any cuts or edits is MANDATORY to process any claim. Claims must be raised within 48 hours of delivery. We do not accept returns for opened or used products under any circumstances."
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping within India typically takes 5-7 business days, depending on your location. You will receive a tracking link via email/SMS once your order is dispatched."
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can only be cancelled before they are dispatched. Once the order status changes to 'Shipped', cancellation is no longer possible."
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, Nutriwell Organics ships exclusively within the territory of India."
  }
];

export default function FAQs() {
  const [open, setOpen] = useState(0);

  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#14251b] pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-4">Support</p>
          <h1 className="font-display text-4xl md:text-5xl text-[#0f4d2c] mb-6">Frequently Asked <span className="italic text-gold-gradient">Questions</span></h1>
          <p className="text-[#5d6b61] text-base font-light">Find answers to our most common queries and customer care policies below.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border border-[#e6dfcc] rounded-2xl overflow-hidden transition-all duration-300 ${open === idx ? 'bg-white shadow-lg' : 'bg-transparent'}`}
            >
              <button 
                onClick={() => setOpen(open === idx ? -1 : idx)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
              >
                <span className={`font-display text-lg ${open === idx ? 'text-[#b07f24]' : 'text-[#0a3520]'}`}>
                  {faq.q}
                </span>
                <span className={`text-[#b07f24] text-2xl transition-transform duration-300 ${open === idx ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div 
                className={`px-6 text-[#5d6b61] font-light leading-relaxed overflow-hidden transition-all duration-300 ${open === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Care Box */}
        <div className="mt-16 bg-[#0a1813] text-[#fdfcf8] rounded-[2rem] p-10 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-[#0f4d2c]/40 to-transparent opacity-50 pointer-events-none" />
           <div className="relative z-10">
              <h3 className="font-display text-2xl mb-4 text-[#e7c886]">Need Further Assistance?</h3>
              <p className="font-light text-[#fdfcf8]/80 mb-6 max-w-md mx-auto">Our Customer Care team is available Monday to Saturday, 10:00 AM to 6:00 PM (IST).</p>
              <p className="text-lg font-medium tracking-wide">Care@NutriwellOrganics.com</p>
           </div>
        </div>

      </div>
    </main>
  );
}