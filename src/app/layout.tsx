import type { Metadata } from 'next'
import { Inter, Source_Code_Pro } from 'next/font/google'
import './global.css'
import Head from 'next/head';
import favicon from '../../public/favicon.ico'

export const SCP = Source_Code_Pro({
  subsets: ['latin'],
  // CSS variable
  variable: '--font-scp'
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alan Ly',
  description: 'My website',
  icons: {
    icon: {
      url: "/favicon.png",
      type: "image/png",
    },
    shortcut: { url: "/favicon.png", type: "image/png" },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={SCP.className}>{children}</body>
    </html>
  )
}
