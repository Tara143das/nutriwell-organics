import { Manrope, Fraunces } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HolisticChatbot from '@/components/ui/HolisticChatbot'
import { AuthProvider } from '@/lib/auth'
import { CartProvider } from '@/lib/cartContext'
import CartDrawer from '@/components/cart/CartDrawer'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata = {
  title: 'Nutriwell Organics — Ancient Healing with Modern Wellness',
  description:
    'A 360° holistic ecosystem combining Sacred Botanicals, Therapeutic Food, Yogic Balance, and Cellular Defense.',
  icons: {
    icon: '/logo1.svg',
    shortcut: '/logo1.svg',
    apple: '/logo1.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body
        className="min-h-screen flex flex-col bg-[var(--paper)] font-sans text-[var(--ink)] antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">{children}</main>
            <Footer />
            <HolisticChatbot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}