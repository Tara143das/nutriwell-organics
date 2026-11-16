import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy | Nutriwell Organics',
  description: 'Shipping and Delivery Policy for Nutriwell Organics orders across India.',
};

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#14251b] pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-4">Customer Support</p>
          <h1 className="font-display text-4xl md:text-5xl text-[#0f4d2c] mb-6">Shipping & <span className="italic text-gold-gradient">Delivery Policy</span></h1>
          <p className="text-[#5d6b61] text-sm font-light">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-10 text-[#3a4740] font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">1. Coverage & Service Area</h2>
            <p className="mb-4">
              Nutriwell Organics ships products across major pincodes within the Republic of India via reputed national courier partners (e.g., BlueDart, Delhivery, Expressbees, India Post). Currently, we do not fulfill international orders.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">2. Order Processing & Timelines</h2>
            <ul className="list-disc pl-5 space-y-3 text-[#5d6b61]">
              <li><strong>Dispatch Time:</strong> Orders are processed and dispatched within 24 to 48 business hours after order confirmation and payment authorization.</li>
              <li><strong>Delivery Timeline:</strong> Standard delivery generally takes <strong>5 to 7 business days</strong> depending on the destination pincode (Metro cities: 3–5 days; Tier 2/3 & Remote regions: 5–8 days).</li>
              <li><strong>Tracking:</strong> Once dispatched, an automated tracking link with courier details is sent to your registered email and phone number via SMS/WhatsApp.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">3. Shipping Charges</h2>
            <div className="bg-[#f6f2e7] p-6 rounded-2xl border border-[#e6dfcc] mb-4">
              <p className="text-[#0a3520] font-medium text-sm mb-2">Standard Shipping Structure:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-[#5d6b61]">
                <li><strong>Prepaid Orders above ₹999:</strong> FREE Shipping nationwide.</li>
                <li><strong>Prepaid Orders below ₹999:</strong> Flat ₹70 shipping charge applied at checkout.</li>
                <li><strong>Cash on Delivery (COD):</strong> If applicable, a non-refundable COD processing fee of ₹50 applies.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">4. Customer Responsibility & Incorrect Address</h2>
            <p className="mb-4">
              It is the customer’s sole responsibility to provide complete and accurate delivery details, including correct recipient name, door number, street address, land mark, and 6-digit Pincode. 
              <br /><br />
              If a package is returned to our facility due to incorrect address, invalid contact number, or repeated failed delivery attempts by the courier rider, **re-shipping charges (₹100) will be levied on the customer** before re-dispatch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">5. Unforeseen Delays & Limitation of Liability</h2>
            <p className="mb-4">
              Nutriwell Organics is not liable for unexpected delivery delays caused by natural disasters, severe weather conditions, national strikes, festive bandhs, or courier operational bottlenecks. However, our customer care team will actively assist in expediting delayed shipments.
            </p>
          </section>

          <hr className="border-[#e6dfcc] my-12" />

          <p className="text-sm text-[#5d6b61] text-center">
            Have questions regarding your shipment? Contact us at <a href="mailto:care@nutriwellorganics.com" className="text-[#b07f24] hover:underline">care@nutriwellorganics.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}