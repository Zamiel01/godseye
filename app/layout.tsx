import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/navigation'

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
      <body className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white antialiased">
        <Navigation />
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  )
}
