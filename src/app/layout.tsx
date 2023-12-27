import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CSI NMAMIT',
  description: 'CSI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='light'>
      <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link
  rel="icon"
  href="/csi-logo?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
      </head>
      <Providers>
      <body className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>
        <Navbar/>
        {children}
        <Footer/>
        </body>
        </Providers>
    </html>
  )
}
