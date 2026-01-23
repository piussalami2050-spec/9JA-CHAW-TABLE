export const metadata = {
  title: 'Nigerian Meal Planner',
  description: 'Healthy Nigerian meal planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
