import type { Metadata } from 'next'
import { Fraunces, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

// Display face for every celebration surface — Fraunces' soft, high-contrast
// serif carries far more warmth at large sizes than a neutral garalde.
const fraunces = Fraunces({
  variable: '--font-celebration',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Secondary serif, used italic for taglines and ornamental lines.
const cormorant = Cormorant_Garamond({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-dashboard',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'velli',
  description: 'A celebration page for the people you love.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${cormorant.variable} ${inter.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
