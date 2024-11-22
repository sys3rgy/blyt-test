import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBarLayout from '@/layouts/NavBarLayout';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { DataContextProvider } from '@/context/DataContext';
import { GoogleAnalytics } from '@next/third-parties/google'
import FacebookPixel from '@/components/FacebookPixelComponent/FacebookPixel';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BLYT | Business Loyalty For All',
  description: 'BLYT | Business Loyalty For All',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataContextProvider>
          <NavBarLayout>
            {children}
            <FacebookPixel />
            <GoogleAnalytics gaId="G-2PHY5EK34S" />
            <SpeedInsights />
          </NavBarLayout>
        </DataContextProvider>
      </body>
    </html>
  )
}
