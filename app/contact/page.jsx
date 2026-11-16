'use client';

export default function ContactUs() {
  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#14251b] pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Info */}
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-4">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-5xl text-[#0f4d2c] mb-6">Contact <span className="italic text-gold-gradient">Us</span></h1>
          <p className="text-[#5d6b61] text-lg font-light leading-relaxed mb-12 max-w-md">
            Whether you have a question about our formulations, your order, or Ayurvedic living, our apothecary team is here to assist you.
          </p>

          <div className="space-y-8">
            <div>
              <h4 className="font-display text-xl text-[#0a3520] mb-2">Customer Care</h4>
              <p className="text-[#5d6b61] font-light text-sm mb-1">Mon - Sat | 10:00 AM - 6:00 PM (IST)</p>
              <a href="mailto:care@nutriwellorganics.com" className="text-[#b07f24] font-medium hover:underline">care@nutriwellorganics.com</a>
            </div>
            
            <div>
              <h4 className="font-display text-xl text-[#0a3520] mb-2">Corporate Office</h4>
              <p className="text-[#5d6b61] font-light text-sm leading-relaxed max-w-xs">
                Nutriwell Organics Pvt. Ltd.<br/>
                Kolkata, West Bengal, India<br/>
                (By Appointment Only)
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-20px_rgba(10,53,32,0.15)] p-8 md:p-12 border border-[#e6dfcc]/60">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully! Our team will contact you soon.'); }}>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0a3520]">First Name</label>
                <input type="text" required className="border-b border-[#e6dfcc] py-2 bg-transparent focus:outline-none focus:border-[#b07f24] transition-colors text-sm font-light text-[#14251b]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0a3520]">Last Name</label>
                <input type="text" className="border-b border-[#e6dfcc] py-2 bg-transparent focus:outline-none focus:border-[#b07f24] transition-colors text-sm font-light text-[#14251b]" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0a3520]">Email Address</label>
              <input type="email" required className="border-b border-[#e6dfcc] py-2 bg-transparent focus:outline-none focus:border-[#b07f24] transition-colors text-sm font-light text-[#14251b]" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0a3520]">Message</label>
              <textarea required rows="4" className="border-b border-[#e6dfcc] py-2 bg-transparent focus:outline-none focus:border-[#b07f24] transition-colors text-sm font-light text-[#14251b] resize-none"></textarea>
            </div>

            <button type="submit" className="w-full bg-[#0a3520] text-[#fdfcf8] py-4 rounded-full text-[12px] font-semibold tracking-[0.16em] uppercase hover:bg-[#0f4d2c] transition-colors mt-4">
              Send Message
            </button>
            <p className="text-[11px] text-[#5d6b61] text-center mt-4">By submitting this form, you agree to our Privacy Policy.</p>
          </form>
        </div>

      </div>
    </main>
  );
}