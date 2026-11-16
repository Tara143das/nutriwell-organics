import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Nutriwell Organics',
  description: 'Terms of Service, Disclaimers, and User Agreements for Nutriwell Organics.',
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#14251b] pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-4">Legal Portal</p>
          <h1 className="font-display text-4xl md:text-5xl text-[#0f4d2c] mb-6">Terms of <span className="italic text-gold-gradient">Service</span></h1>
          <p className="text-[#5d6b61] text-sm font-light">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-10 text-[#3a4740] font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing, browsing, or purchasing from Nutriwell Organics, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our platform. We reserve the right to modify these terms at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">2. Medical & FSSAI Disclaimer (Strictly Read)</h2>
            <div className="bg-[#f6f2e7] p-6 rounded-xl border border-[#e6dfcc] mb-4">
              <p className="text-[#0a3520] font-medium text-sm mb-2">IMPORTANT NOTICE:</p>
              <p className="text-sm">
                Our products are formulated based on traditional Ayurvedic principles and are intended for general wellness. <strong>They are NOT intended to diagnose, treat, cure, or prevent any medical condition or disease.</strong> Nutriwell Organics products are not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician before starting any new wellness regimen.
              </p>
            </div>
            <p>
              By purchasing, the user acknowledges that organic/herbal ingredients may affect individuals differently. Nutriwell Organics holds <strong>zero liability</strong> for any adverse reactions, allergies, or health complications arising from the use of our products. Users are strongly advised to perform a patch test for topical products and read the ingredient list carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">3. Pricing & Order Cancellation</h2>
            <p className="mb-4">
              All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices without notice. 
              <br /><br />
              <strong>Company Right to Cancel:</strong> Nutriwell Organics reserves the absolute right to cancel any order at its sole discretion, including but not limited to cases of suspected fraud, pricing errors, or inventory unavailability. In such cases, the full amount will be refunded.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              All content on this website, including but not limited to logos, text, graphics, images, product formulations, and data compilations, is the exclusive property of Nutriwell Organics and is protected by Indian Copyright and Trademark laws. Unauthorized use, reproduction, or distribution is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">5. Governing Law & Jurisdiction</h2>
            <p className="mb-4">
              These terms are governed strictly by the laws of India. Any disputes arising out of or relating to the use of this website or the purchase of products shall be subject to the exclusive jurisdiction of the courts located in West Bengal, India.
            </p>
          </section>

          <hr className="border-[#e6dfcc] my-12" />
        </div>
      </div>
    </main>
  );
}