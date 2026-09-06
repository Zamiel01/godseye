import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/navigation'
import Script from 'next/script'
import { SupportPopup } from '@/components/support-popup'

export const metadata: Metadata = {
  title: 'God\'s Eye',
  description: 'Cybersecurity Analytics and Monitoring',
  icons: {
    icon: [
      {
        url: '/shield.png',
        type: 'image/png',
      }
    ],
    shortcut: '/shield.png',
    apple: '/shield.png',
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen antialiased">
        <Script
          data-goatcounter="https://zamiel.goatcounter.com/count"
          src="https://gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
        <Navigation />
        <main className="w-full">
          {children}
        </main>
        <SupportPopup />
      </body>
    </html>
  )
}
