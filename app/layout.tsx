import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gods Eye',
  description: 'Cybersecurity Analytics and Monitoring',
  icons: {
    icon: [
      {
        url: '/shield-eye.svg',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/shield-eye.svg',
    apple: '/shield-eye.svg',
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
