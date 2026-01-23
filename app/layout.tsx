import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nigerian Meal Planner - Healthy Nigerian Recipes',
  description: 'Plan healthy Nigerian meals with reduced salt and sugar intake',
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
