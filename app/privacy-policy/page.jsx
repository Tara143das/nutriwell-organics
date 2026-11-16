import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Nutriwell Organics',
  description: 'Privacy Policy and Data Protection guidelines for Nutriwell Organics.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#14251b] pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#b07f24] font-semibold mb-4">Legal Portal</p>
          <h1 className="font-display text-4xl md:text-5xl text-[#0f4d2c] mb-6">Privacy <span className="italic text-gold-gradient">Policy</span></h1>
          <p className="text-[#5d6b61] text-sm font-light">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-10 text-[#3a4740] font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">1. Introduction & Compliance</h2>
            <p className="mb-4">
              Welcome to Nutriwell Organics. We value your trust. This Privacy Policy outlines how we collect, use, and protect your data in compliance with the Information Technology Act, 2000, and applicable Indian data protection laws. By accessing our platform, you explicitly consent to our data practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect minimal necessary information to fulfill your orders and enhance your experience:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#5d6b61]">
              <li><strong>Identity Data:</strong> Name, phone number, and email address.</li>
              <li><strong>Shipping Data:</strong> Delivery addresses, billing details, and pincodes.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and device information for security analytics.</li>
            </ul>
            <p className="mt-4 text-sm text-[#b07f24] font-medium">Note: We do NOT store your payment card details. All transactions are securely processed via certified third-party payment gateways compliant with RBI guidelines.</p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">3. How We Use Your Data</h2>
            <p className="mb-4">Your data is strictly used for operational purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#5d6b61]">
              <li>To process, ship, and track your orders.</li>
              <li>To communicate important updates, legal notices, or security alerts.</li>
              <li>To prevent fraud, abuse, and unauthorized access to our systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">4. Data Sharing & Third Parties</h2>
            <p className="mb-4">
              <strong>Nutriwell Organics does not sell your personal data.</strong> However, to operate effectively, we share necessary details with trusted partners:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#5d6b61]">
              <li><strong>Logistics:</strong> Delivery partners (e.g., Delhivery, BlueDart, India Post) receive your name, phone number, and address strictly for delivery fulfillment.</li>
              <li><strong>Legal Authorities:</strong> We may disclose information if required by Indian law enforcement agencies or court orders.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#0a3520] mb-4">5. Company Rights & Limitation of Liability</h2>
            <p className="mb-4">
              Nutriwell Organics employs industry-standard security measures (including SSL and secure database protocols). However, we are not liable for unauthorized access resulting from user negligence (e.g., sharing passwords) or systemic internet vulnerabilities beyond our control.
            </p>
          </section>

          <hr className="border-[#e6dfcc] my-12" />

          <p className="text-sm text-[#5d6b61] text-center">
            For privacy-related inquiries, please visit our <Link href="/contact" className="text-[#b07f24] hover:underline">Contact Us</Link> page.
          </p>
        </div>
      </div>
    </main>
  );
}