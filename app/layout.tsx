import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gods Eye',
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
      <body>{children}</body>
    </html>
  )
}
