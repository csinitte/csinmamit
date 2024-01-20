
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import Footer from '@/components/Footer'
import { Roboto } from 'next/font/google'
import { Toaster } from 'sonner'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

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
    <html lang="en" suppressHydrationWarning>
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
      <body className={cn('min-h-screen font-sans antialiased grainy dark:bg-black', roboto.className)}>
        <Navbar/>
        {children}
        <Footer/>
        <Toaster/>
    

        </body>
        </Providers>
    </html>
  )
}
