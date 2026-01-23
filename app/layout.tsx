import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nigerian Meal Planner',
  description: 'Healthy Nigerian meal planning app',
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
