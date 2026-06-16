import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VIGIL - Operational Control Room',
  description: 'Collaborative operational control room for Releases and Incidents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}