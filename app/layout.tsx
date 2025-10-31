import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Audio API',
}

export default function RootLayout(props: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body className="p-4 antialiased">{props.children}</body>
    </html>
  )
}
