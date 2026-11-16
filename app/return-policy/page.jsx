import Link from 'next/link';

export const metadata = {
  title: 'Return & Refund Policy | Nutriwell Organics',
  description: 'Strict Return, Replacement, and Refund guidelines for Nutriwell Organics.',
};

export default function ReturnPolicy() {
  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#14251b] pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-4">Customer Support</p>
          <h1 className="font-display text-4xl md:text-5xl text-[#0f4d2c] mb-6">Return & <span className="italic text-gold-gradient">Refund Policy</span></h1>
          <p className="text-[#5d6b61] text-sm font-light">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-10 text-[#3a4740] font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">1. Hygiene & Health Safety Standard (No Return Policy)</h2>
            <p className="mb-4">
              Due to the personal care, consumable, and Ayurvedic nature of our products, **Nutriwell Organics maintains a strict NO-RETURN and NO-REFUND policy once a product has been opened, seal-broken, or used.** We do not accept returns based on personal taste preferences, fragrance dislike, or change of mind after purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">2. Mandatory Requirements for Transit Damage / Missing Items</h2>
            <div className="bg-[#0a1813] text-[#fdfcf8] p-8 rounded-2xl border border-[#b07f24]/30 mb-6">
              <h3 className="font-display text-lg text-[#e7c886] mb-3">MANDATORY UNBOXING VIDEO REQUIREMENT:</h3>
              <p className="text-sm font-light leading-relaxed text-[#fdfcf8]/80 mb-4">
                To claim a replacement or refund for items damaged during transit, missing items, or wrong products received, the customer <strong>MUST provide an uninterrupted, unedited Unboxing Video</strong>.
              </p>
              <ul className="list-disc pl-5 text-xs text-[#fdfcf8]/70 space-y-2">
                <li>The video must clearly show the unopened outer shipping box with the courier shipping label visible.</li>
                <li>The video must show the box being cut open and the product inspected in real-time.</li>
                <li>Videos with cuts, pauses, blurriness, or recorded after the package is already opened will be <strong>STRICTLY REJECTED</strong>.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">3. Claim Window & Process</h2>
            <p className="mb-4">
              All damaged item or wrong item claims must be reported to our support team within <strong>48 hours of delivery timestamp</strong>. Claims raised after 48 hours will not be entertained under any circumstances.
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-[#5d6b61]">
              <li>Send an email to <a href="mailto:care@nutriwellorganics.com" className="text-[#b07f24] font-medium hover:underline">care@nutriwellorganics.com</a> with your Order ID and subject: <em>"Damage Claim - Order #[ID]"</em>.</li>
              <li>Attach the unedited unboxing video and clear photographs of the box label and damaged item.</li>
              <li>Our quality audit team will verify the claim within 24 to 48 hours. Upon approval, a reverse pickup or direct replacement dispatch will be initiated.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">4. Order Cancellation Policy</h2>
            <p className="mb-4">
              Orders can only be cancelled within <strong>2 hours of placing the order</strong> or before the status changes to "Shipped". Once the package is picked up by our courier partner, cancellations are strictly prohibited. 
              <br /><br />
              If an order is cancelled before dispatch, a 100% refund will be credited back to the original source account within 5–7 working days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">5. Refund Processing</h2>
            <p className="mb-4">
              Approved refunds for returned damages will be credited back to the original payment method (Credit/Debit Card, Net Banking, UPI) within <strong>5 to 7 business days</strong> following quality verification at our warehouse. Shipping charges and COD fees are non-refundable.
            </p>
          </section>

          <hr className="border-[#e6dfcc] my-12" />

          <p className="text-sm text-[#5d6b61] text-center">
            Need assistance with an order? Contact our helpdesk at <Link href="/contact" className="text-[#b07f24] hover:underline">Contact Us</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}